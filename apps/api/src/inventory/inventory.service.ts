import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import pLimit from 'p-limit';
import { Image } from 'image-js';
import * as fuzz from 'fuzzball';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/nestjs';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { MessageContent } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CatalogsService } from '../catalogs/catalogs.service';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import puppeteer, { Browser, PuppeteerLaunchOptions, Page } from 'puppeteer';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

import { Supabase } from '../supabase';
import { INVENTORY } from '../common/prompts';
import { InventoryInfo } from '../common/interface';
import { preferredHosts } from '../common/utils/host-utils';

/**
 * Safely extracts error message from unknown error types
 * @param error - The error object to extract message from
 * @returns The error message as a string
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Service responsible for AI-powered furniture inventory management and analysis.
 * 
 * This service provides comprehensive functionality for:
 * - AI-powered furniture analysis using OpenAI's vision models
 * - Image processing and optimization for marketplace listings
 * - Web scraping for competitive pricing analysis
 * - Automated catalog generation with professional descriptions
 * - Integration with Google Lens for visual search capabilities
 * 
 * Features:
 * - Concurrent image processing with configurable limits
 * - Browser automation using Puppeteer for web scraping
 * - AI-powered pricing analysis and market research
 * - Professional listing generation optimized for sales
 * 
 * @example
 * ```typescript
 * // Analyze furniture from uploaded images
 * const result = await inventoryService.createCatalog(files, userId);
 * 
 * // Process images and generate listings
 * const catalog = await inventoryService.processInventoryImages(images);
 * ```
 */
@Injectable()
export class InventoryService implements OnModuleDestroy, OnModuleInit {
  /** Puppeteer browser instance for web scraping operations */
  private browser: Browser;
  
  /** Maximum number of concurrent browser pages to maintain in the pool */
  private readonly maxPages = 5;
  
  /** Maximum number of concurrent operations to prevent resource exhaustion */
  private readonly concurrency = 5;
  
  /** Pool of reusable browser pages for efficient resource management */
  private readonly pagePool: Page[] = [];
  
  /** OpenAI chat model instance for AI-powered furniture analysis */
  private readonly chatModel: ChatOpenAI;
  
  /** Promise that resolves when browser initialization is complete */
  private browserInitialized: Promise<void>;
  
  /** Logger instance for service operations */
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
    private readonly catalogsService: CatalogsService,
  ) {
    this.browserInitialized = this.initBrowser();
    this.chatModel = new ChatOpenAI({
      modelName: this.configService.getOrThrow<string>('MODEL_NAME'),
      temperature: 0,
    });
  }

  async onModuleInit() {
    await this.browserInitialized;
    await this.initPagePool();
  }

  async onModuleDestroy() {
    await this.closePagePool();
    await this.closeBrowser();
  }

  private async initBrowser(): Promise<void> {
    try {
      const options: PuppeteerLaunchOptions = {
        headless: this.configService.get<string>('ENVIRONMENT') !== 'dev',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      };
      const chromePath = this.configService.get<string>('CHROME_PATH');
      if (chromePath) {
        options.executablePath = chromePath;
      }
      this.browser = await puppeteer.launch(options);
      this.logger.log('Browser initialized successfully');
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Failed to initialize browser: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  private async initPagePool(): Promise<void> {
    try {
      for (let i = 0; i < this.maxPages; i++) {
        const page = await this.browser.newPage();
        this.pagePool.push(page);
      }
      this.logger.log(`Page pool initialized with ${this.maxPages} pages`);
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Failed to initialize page pool: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  private async closePagePool(): Promise<void> {
    await Promise.all(this.pagePool.map((page) => page.close()));
    this.pagePool.length = 0;
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async getPage(): Promise<Page> {
    await this.browserInitialized;
    if (this.pagePool.length > 0) {
      return this.pagePool.pop();
    }
    try {
      return await this.browser.newPage();
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Failed to create new page: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  private async releasePage(page: Page): Promise<void> {
    if (this.pagePool.length < this.maxPages) {
      await page.goto('about:blank');
      this.pagePool.push(page);
    } else {
      await page.close();
    }
  }

  private async convertToJpeg(file: Express.Multer.File): Promise<Buffer> {
    try {
      const image = await Image.load(file.buffer);
      const jpegUint8Array = await image.toBuffer({ format: 'jpeg' });
      return Buffer.from(jpegUint8Array);
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Error converting image to JPEG: ${getErrorMessage(error)}`);
      throw new Error('Failed to convert image to JPEG');
    }
  }

  private async getUserTierAndLimit(
    userId: string,
  ): Promise<{ tier: string; limit: number }> {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user tier: ${error.message}`);
    }

    const tier = data.tier.toLowerCase();
    let limit: number;

    switch (tier) {
      case 'free':
        limit = parseFloat(
          this.configService.getOrThrow<string>('FREE_INVENTORY_LIMIT'),
        );
        break;
      case 'basic':
        limit = parseFloat(
          this.configService.getOrThrow<string>('BASIC_INVENTORY_LIMIT'),
        );
        break;
      default:
        limit = Infinity;
    }

    return { tier, limit };
  }

  private async getUserInventoryCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .getClient()
      .from('inventory')
      .select('id', { count: 'exact' })
      .eq('seller_id', userId);

    if (error) {
      throw new Error(`Failed to get inventory count: ${error.message}`);
    }

    return count;
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}_${uuidv4()}.jpg`;
    const jpegBuffer = await this.convertToJpeg(file);

    const { error: uploadError } = await this.supabase
      .getClient()
      .storage.from('inventory')
      .upload(filename, jpegBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    return this.getPublicUrl(filename);
  }

  private getPublicUrl(filename: string): string {
    const { data } = this.supabase
      .getClient()
      .storage.from('inventory')
      .getPublicUrl(filename);

    if (!data.publicUrl) {
      throw new Error('No public URL found for the uploaded image');
    }

    return data.publicUrl;
  }

  async createCatalog(
    req: Request,
    files: Express.Multer.File[],
  ): Promise<void> {
    let catalog;
    try {
      const user = await this.getUserFromRequest(req);

      const { tier, limit } = await this.getUserTierAndLimit(user.id);
      const currentCount = await this.getUserInventoryCount(user.id);

      if (currentCount + files.length > limit) {
        throw new Error(
          `User with tier ${tier} is limited to ${limit} items in inventory. Current count: ${currentCount}`,
        );
      }

      catalog = await this.createCatalogForUser(user.id);
      const imageUrls = await this.uploadImages(files);
      const inventoryData = await this.inventoryAgent(imageUrls);
      const pricedInventoryData = this.preparePricedInventoryData(
        inventoryData,
        catalog.id,
        user.id,
      );
      const inventory = await this.insertInventory(pricedInventoryData);
      return await this.catalogsService.createCatalog(catalog.id, inventory);
    } catch (error) {
      this.logger.error(`Error in createCatalog: ${getErrorMessage(error)}`);
      if (catalog && catalog.id) {
        await this.supabase
          .getClient()
          .from('catalogs')
          .delete()
          .eq('id', catalog.id);
      }
      throw new Error(`Failed to create catalog: ${getErrorMessage(error)}`);
    }
  }

  private async getUserFromRequest(req: Request): Promise<any> {
    const {
      data: { user },
    } = await this.supabase
      .getClient()
      .auth.getUser(ExtractJwt.fromAuthHeaderAsBearerToken()(req));
    return user;
  }

  private async createCatalogForUser(userId: string): Promise<any> {
    const { data: catalog, error } = await this.supabase
      .getClient()
      .from('catalogs')
      .insert({ seller_id: userId })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create catalog: ${getErrorMessage(error)}`);
    }

    return catalog;
  }

  private async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  private preparePricedInventoryData(
    inventoryData: InventoryInfo[],
    catalogId: string,
    sellerId: string,
  ): any[] {
    return inventoryData.map((item) => ({
      title: item.name,
      price: parseFloat(item.price),
      category: item.category,
      image_url: item.imageUrl,
      similar_url: item.similarUrl,
      condition: item.condition,
      description: item.description,
      catalog_id: catalogId,
      seller_id: sellerId,
    }));
  }

  private async insertInventory(pricedInventoryData: any[]): Promise<any[]> {
    const inventoryResults = [];

    for (const item of pricedInventoryData) {
      const { tier, limit } = await this.getUserTierAndLimit(item.seller_id);
      const currentCount = await this.getUserInventoryCount(item.seller_id);

      if (currentCount >= limit) {
        throw new Error(
          `User with tier ${tier} has reached the limit of ${limit} items in inventory.`,
        );
      }

      const { data, error } = await this.supabase
        .getClient()
        .from('inventory')
        .insert(item)
        .select();

      if (error) {
        throw new Error(`Failed to insert inventory item: ${error.message}`);
      }

      inventoryResults.push(data[0]);
    }

    return inventoryResults;
  }

  async inventoryAgent(imageUrls: string[]): Promise<InventoryInfo[]> {
    const [categories, conditions] = await Promise.all([
      this.getTypes('category'),
      this.getTypes('condition'),
    ]);

    const limit = pLimit(this.concurrency);

    const results = await Promise.all(
      imageUrls.map((imageUrl) =>
        limit(() => this.processImageUrl(imageUrl, categories, conditions)),
      ),
    );
    return results.filter((result): result is InventoryInfo => result !== null);
  }

  private async getTypes(enumType: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .getClient()
      .rpc('get_types', { enum_type: enumType });

    if (error) {
      throw new Error(`Failed to get types: ${error.message}`);
    }

    return data;
  }

  private async processImageUrl(
    imageUrl: string,
    categories: string[],
    conditions: string[],
  ): Promise<InventoryInfo | null> {
    const page = await this.getPage();
    try {
      await this.navigateToGoogleLens(page, imageUrl);
      const inventory = await this.scrapeInventoryData(page);
      const filteredInventory = inventory.slice(0, 20);

      const tools = await this.createRetrievalTool(
        filteredInventory.map((item) => item.url),
      );

      const prompt = this.createPrompt(inventory, categories, conditions);
      const result = await this.executeAgent(prompt, tools, imageUrl);
      const inventoryInfo = await this.extractFields(result.output);

      inventoryInfo.imageUrl = imageUrl;

      inventoryInfo.similarUrl = this.findSimilarUrl(
        inventoryInfo,
        filteredInventory,
      );

      return inventoryInfo;
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Error processing image URL: ${getErrorMessage(error)}`);
      return null;
    } finally {
      await this.releasePage(page);
    }
  }

  private findSimilarUrl(
    inventoryInfo: InventoryInfo,
    filteredInventory: any[],
  ): string {
    const inventoryPrice = parseFloat(inventoryInfo.price.replace('$', ''));
    let bestMatch: {
      url: string;
      similarity: number;
      isPreferred: boolean;
    } | null = null;
    let highestSimilarity = -1;
    const preferred = preferredHosts();

    for (const item of filteredInventory) {
      const itemPrice = parseFloat(item.price.replace('$', ''));
      if (inventoryPrice < itemPrice) {
        const similarity = fuzz.ratio(
          inventoryInfo.name.toLowerCase(),
          item.title.toLowerCase(),
        );

        const isPreferred = preferred.some((host) => item.url.includes(host));

        if (isPreferred && similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = { url: item.url, similarity, isPreferred };
        } else if (
          !bestMatch ||
          (!bestMatch.isPreferred && similarity > highestSimilarity)
        ) {
          highestSimilarity = similarity;
          bestMatch = { url: item.url, similarity, isPreferred };
        }
      }
    }

    return bestMatch
      ? bestMatch.url
      : filteredInventory.length > 0
        ? filteredInventory[0].url
        : '';
  }

  private async navigateToGoogleLens(
    page: Page,
    imageUrl: string,
  ): Promise<void> {
    try {
      await page.goto(`https://lens.google.com/uploadbyurl?url=${imageUrl}`, {
        waitUntil: 'networkidle0',
        timeout: 30000, // Increase timeout to 30 seconds
      });

      // Wait for either the target element or an error message
      await page.waitForFunction(
        () => {
          const targetElement = document.querySelector('.UAiK1e');
          const errorElement = document.querySelector('.error-message'); // Replace with actual error message selector
          return targetElement || errorElement;
        },
        { timeout: 30000 },
      );

      // Check if the target element exists
      const targetElement = await page.$('.UAiK1e');
      if (!targetElement) {
        throw new Error('Target element not found, possible error on page');
      }

      // Wait for search results
      await page.waitForFunction(
        () => {
          const resultElements = document.querySelectorAll('.Vd9M6');
          return resultElements.length > 0;
        },
        { timeout: 30000 },
      );
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Error navigating to Google Lens: ${getErrorMessage(error)}`);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  private async scrapeInventoryData(page: Page): Promise<any[]> {
    return page.evaluate(() => {
      const results = [];
      const resultElements = document.querySelectorAll('.Vd9M6');

      resultElements.forEach((element) => {
        const titleElement = element.querySelector('.UAiK1e');
        const urlElement = element.querySelector('.GZrdsf');
        const priceElement = element.querySelector('.DdKZJb');

        if (titleElement && urlElement && priceElement) {
          const priceText = priceElement.textContent.trim();
          if (priceText.startsWith('$')) {
            results.push({
              title: titleElement.textContent.trim(),
              url: urlElement.getAttribute('href'),
              price: priceText,
            });
          }
        }
      });

      return results;
    });
  }

  private createPrompt(
    inventory: any[],
    categories: string[],
    conditions: string[],
  ): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      ['system', 'You are a helpful assistant'],
      ['placeholder', '{chat_history}'],
      [
        'human',
        [
          {
            type: 'text',
            text: INVENTORY(
              inventory.map((item) => item.title),
              categories,
              conditions,
              inventory.map((item) => item.price),
            ),
          },
          {
            type: 'image_url',
            image_url: {
              url: '{image_url}',
              detail: 'high',
            },
          },
        ],
      ],
      ['placeholder', '{agent_scratchpad}'],
    ]);
  }

  private async executeAgent(
    prompt: ChatPromptTemplate,
    tools: any[],
    imageUrl: string,
  ): Promise<any> {
    const agent = await createOpenAIToolsAgent({
      llm: this.chatModel,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    return agentExecutor.invoke({
      image_url: imageUrl,
    });
  }

  private async extractFields(text: MessageContent): Promise<InventoryInfo> {
    const stringifiedText =
      typeof text === 'string' ? text : JSON.stringify(text);
    const fieldsRegex = /(\w+):\s*([\s\S]+?)(?=\n\w+:|$)/g;
    const fields: { [key: string]: string } = {};

    let match;
    while ((match = fieldsRegex.exec(stringifiedText)) !== null) {
      const [, key, value] = match;
      fields[key] = value
        .trim()
        .replace(/\\n/g, '\n')
        .replace(/^["']|["']$/g, '');
    }

    return {
      name: fields.name || '',
      category: fields.category || '',
      condition: fields.condition || '',
      price: fields.price || '',
      description: fields.description || '',
      imageUrl: '',
      similarUrl: '',
    };
  }

  private async createRetrievalTool(urls: string[]): Promise<any> {
    const limit = pLimit(this.concurrency);
    const docs = await Promise.all(
      urls.map((url) => limit(() => this.loadDocument(url))),
    );

    const successfulDocs = docs.filter((doc) => doc !== null);

    const docsList = successfulDocs.flat();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const docSplits = await textSplitter.splitDocuments(docsList);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      docSplits,
      new OpenAIEmbeddings(),
    );

    const retriever = vectorStore.asRetriever();

    return [
      createRetrieverTool(retriever, {
        name: 'retrieve_item_information',
        description: 'Search and return information about an item.',
      }),
    ];
  }

  private async loadDocument(url: string): Promise<any> {
    try {
      const loader = new CheerioWebBaseLoader(url);
      const document = await Promise.race([
        loader.load(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000),
        ),
      ]);
      return document;
    } catch (error) {
      this.logger.warn(`Failed to load URL ${url}: ${getErrorMessage(error)}`);
      return null;
    }
  }
}

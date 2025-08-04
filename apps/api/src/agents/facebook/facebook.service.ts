import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { MessageContent } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import * as Sentry from '@sentry/nestjs';

import { Supabase } from '../../supabase';
import { RESPONSE } from '../../common/prompts';
import { Message, AIResponse } from '../../common/interface';

/**
 * Enum defining supported Facebook platforms for messaging integration
 */
enum Platform {
  Messenger = 'messenger',
  Instagram = 'instagram',
}

/**
 * Service for handling Facebook Marketplace integration and automated messaging.
 * 
 * This service provides comprehensive functionality for:
 * - Automated posting to Facebook Marketplace
 * - AI-powered customer communication via Messenger
 * - Message processing and response generation
 * - Lead qualification and buyer interaction management
 * - Integration with Facebook Graph API for marketplace operations
 * 
 * Features:
 * - Real-time message processing with AI responses
 * - Automated listing management and updates
 * - Customer inquiry handling and lead qualification
 * - Integration with Supabase for data persistence
 * 
 * @example
 * ```typescript
 * // Process incoming customer message
 * await facebookService.processMessage(messageData);
 * 
 * // Generate AI response to buyer inquiry
 * const response = await facebookService.generateResponse(message);
 * ```
 */
@Injectable()
export class FacebookService {
  /** Facebook Graph API base URL for all API calls */
  private readonly apiUrl: string;
  
  /** Facebook Page ID for marketplace posting and messaging */
  private readonly pageId: string;
  
  /** Target platform for messaging (Messenger or Instagram) */
  private readonly platform: Platform;
  
  /** Facebook Page Access Token for API authentication */
  private readonly accessToken: string;
  
  /** Facebook Graph API version to use for all requests */
  private readonly apiVersion: string = '20.0';
  
  /** Facebook Graph API domain */
  private readonly apiDomain: string = 'graph.facebook.com';
  
  /** Logger instance for service operations */
  private readonly logger = new Logger(FacebookService.name);
  
  /** OpenAI chat model for generating intelligent responses to customer inquiries */
  private readonly chatModel: any;

  constructor(
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
  ) {
    this.chatModel = new ChatOpenAI({
      modelName: this.configService.getOrThrow<string>('MODEL_NAME'),
      temperature: 0,
    }).bind({
      response_format: {
        type: 'json_object',
      },
    });
    this.platform = Platform.Messenger;
    this.apiUrl = `https://${this.apiDomain}/v${this.apiVersion}`;
    this.accessToken =
      this.configService.getOrThrow<string>('PAGE_ACCESS_TOKEN');
    this.pageId = this.configService.getOrThrow<string>('PAGE_ID');
  }

  async handleMessage(
    sender: string,
    recipient: string,
    message: { mid: string; text: string },
    referral?: any,
  ): Promise<void> {
    try {
      const insertedMessage = await this.insertIncomingMessage(
        sender,
        recipient,
        message,
        referral,
      );

      this.logger.log('insertedMessage', insertedMessage);

      const conversation = await this.fetchConversation(message.mid);
      const inventory = await this.fetchInventoryForConversation(
        conversation[0].conversation_id,
      );

      this.logger.log('inventory', inventory);
      this.logger.log('conversation', conversation);

      const response: AIResponse = JSON.parse(
        (await this.generateAIResponse(conversation, inventory)).toString(),
      );

      await this.insertAIResponse(insertedMessage, response.message);
      // await this.insertAIReasoning(insertedMessage, response.reasoning);
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error('Error handling message:', error);
      throw error;
    }
  }

  private async insertIncomingMessage(
    sender: string,
    recipient: string,
    message: { mid: string; text: string },
    referral?: any,
  ): Promise<Message> {
    let conversationId: string;
    const { data: existingConversation } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('messages')
      .select('conversation_id')
      .eq('mid', message.mid)
      .limit(1)
      .single();

    if (existingConversation) {
      conversationId = existingConversation.conversation_id;
      await this.supabase
        .getClient()
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', existingConversation.conversation_id);
    } else {
      conversationId = await this.createConversation(referral);
    }

    const { data, error } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('messages')
      .insert({
        mid: message.mid,
        sender,
        recipient,
        content: message.text,
        conversation_id: conversationId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async createConversation(referral: any): Promise<string> {
    const inventoryId = await this.determineInventoryFromMessage(referral);

    const { data: newConversation, error: newConversationError } =
      await this.supabase
        .getClient()
        .from('conversations')
        .insert({
          platform: 'Facebook',
          inventory_id: inventoryId,
        })
        .select()
        .single();

    if (newConversationError) throw newConversationError;
    return newConversation.id;
  }

  private async determineInventoryFromMessage(
    referral: any,
  ): Promise<string | null> {
    if (!referral || !referral.id) {
      this.logger.warn('No referral or referral ID provided');
      return null;
    }

    const { data: inventory, error } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('items')
      .select('id')
      .eq('content_id', referral.id)
      .single();

    if (error) {
      Sentry.captureException(error);
      this.logger.error(`Error fetching inventory: ${error.message}`);
      return null;
    }

    return inventory?.id || null;
  }

  private async fetchConversation(mid: string): Promise<Message[]> {
    const { data: conversation, error: conversationError } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('messages')
      .select('*')
      .eq('mid', mid)
      .order('created_at', { ascending: true });

    if (conversationError) throw conversationError;
    return conversation;
  }

  private async fetchInventoryForConversation(
    conversationId: string,
  ): Promise<any> {
    const { data: conversation, error: conversationError } = await this.supabase
      .getClient()
      .from('conversations')
      .select('inventory_id')
      .eq('id', conversationId)
      .single();

    if (conversationError) throw conversationError;

    const { data: inventory, error: inventoryError } = await this.supabase
      .getClient()
      .from('inventory')
      .select()
      .eq('id', conversation.inventory_id)
      .single();

    if (inventoryError) throw inventoryError;
    return inventory;
  }

  private async generateAIResponse(
    conversation: Message[],
    inventory: any,
  ): Promise<MessageContent> {
    const prompt = ChatPromptTemplate.fromMessages([
      {
        type: 'system',
        content: `${RESPONSE(inventory)}. Return in JSON format.`,
      },
      ...conversation.map((msg) => ({
        type: msg.role?.toLowerCase() as 'human' | 'ai',
        content: msg.content,
      })),
    ]);

    const chain = prompt.pipe(this.chatModel);
    const response = await chain.invoke({});
    return (response as any).content;
  }

  private async insertAIResponse(
    originalMessage: Message,
    content: string,
  ): Promise<void> {
    const { data: existingConversation } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('messages')
      .select('conversation_id')
      .eq('mid', originalMessage.mid)
      .limit(1)
      .single();

    const { error } = await this.supabase
      .getClient()
      .schema('facebook')
      .from('messages')
      .insert({
        mid: originalMessage.mid,
        role: 'AI',
        sender: originalMessage.sender,
        recipient: originalMessage.recipient,
        content,
        conversation_id: existingConversation.conversation_id,
      });

    if (error) {
      Sentry.captureException(error);
      this.logger.error(`Error inserting AI response: ${error.message}`);
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3, slides_v1 } from 'googleapis';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ConfigService } from '@nestjs/config';
import { JWTInput } from 'google-auth-library';
import { MailService } from '@sendgrid/mail';
import * as handlebars from 'handlebars';
import * as Sentry from '@sentry/nestjs';
import * as fs from 'fs';

import { Supabase } from '../supabase';

@Injectable()
export class CatalogsService {
  private readonly sendgrid: MailService;
  private readonly drive: drive_v3.Drive;
  private readonly slides: slides_v1.Slides;
  private readonly logger = new Logger(CatalogsService.name);

  constructor(
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        subject: 'catalogs@furniflip.io',
        private_key: this.configService
          .get<string>('GOOGLE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      } as JWTInput,
      scopes: [
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.sendgrid = new MailService();
    this.drive = google.drive({ version: 'v3', auth });
    this.slides = google.slides({ version: 'v1', auth });
    this.sendgrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async createCatalog(catalogId: string, inventory: any[]): Promise<any> {
    try {
      const { data: catalog } = await this.supabase
        .getClient()
        .from('catalogs')
        .select()
        .eq('id', catalogId)
        .single();

      const {
        data: { user },
      } = await this.supabase
        .getClient()
        .auth.admin.getUserById(catalog.seller_id);

      const presentation = await this.createPresentation(catalogId);
      const presentationId = presentation.data.presentationId;

      await this.removeDefaultSlide(presentationId);
      await this.createTitleSlide(user, presentationId);

      for (let index = 0; index < inventory.length; index++) {
        await this.createSlideForInventory(
          presentationId,
          inventory[index],
          index + 1, // Offset by 1 to account for title slide
        );
      }

      await this.setPresenterPermissions(presentationId, user.email);

      await this.sendEmailWithTemplate(user.email, 'Your catalog is ready!', {
        name: user.user_metadata.first_name,
        url: `https://docs.google.com/presentation/d/${presentationId}`,
      });

      return await this.updateCatalogWithPresentationId(
        catalogId,
        presentationId,
      );
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(
        'Error creating presentation or setting permissions:',
        error,
      );
    }
  }

  private async sendEmailWithTemplate(
    to: string,
    subject: string,
    templateData: any,
  ): Promise<any> {
    const templateSource = fs.readFileSync(
      'src/common/emails/confirm.hbs',
      'utf-8',
    );
    const template = handlebars.compile(templateSource);
    const htmlContent = template(templateData);

    const msg = {
      to: to,
      from: 'catalogs@furniflip.io',
      subject: subject,
      html: htmlContent,
    };

    return await this.sendgrid.send(msg);
  }

  private async updateCatalogWithPresentationId(
    catalogId: string,
    presentationId: string,
  ): Promise<any> {
    return await this.supabase
      .getClient()
      .from('catalogs')
      .update({ presentation_id: presentationId })
      .eq('id', catalogId);
  }

  private async createPresentation(catalogId: string) {
    return this.slides.presentations.create({
      requestBody: {
        title: catalogId,
      },
    });
  }

  private async formatPhoneNumber(phoneNumber: string | null | undefined) {
    if (!phoneNumber) {
      return '';
    }

    const parsedNumber = parsePhoneNumber(phoneNumber, 'US');
    return parsedNumber.formatNational();
  }

  private async removeDefaultSlide(presentationId: string): Promise<void> {
    const presentation = await this.slides.presentations.get({
      presentationId,
    });

    const defaultSlideId = presentation.data.slides?.[0].objectId;

    if (defaultSlideId) {
      await this.slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests: [
            {
              deleteObject: {
                objectId: defaultSlideId,
              },
            },
          ],
        },
      });
    }
  }

  private async createTitleSlide(
    user: any,
    presentationId: string,
  ): Promise<void> {
    const name = user.user_metadata.first_name;
    const phone = user.user_metadata?.phone
      ? await this.formatPhoneNumber(user.user_metadata.phone)
      : null;

    const email = user.email || '';

    const contactInfo = phone != null ? phone : email;
    const contactType = phone != null ? 'phone' : 'email';

    const requests: slides_v1.Schema$Request[] = [
      {
        createSlide: {
          objectId: 'title-slide',
          insertionIndex: 0,
          slideLayoutReference: {
            predefinedLayout: 'BLANK',
          },
        },
      },
      {
        createShape: {
          objectId: 'title-text-box',
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: 'title-slide',
            size: {
              width: { magnitude: 600, unit: 'PT' },
              height: { magnitude: 100, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 60,
              translateY: 100,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: 'title-text-box',
          text: 'Furniture Sale',
        },
      },
      {
        updateTextStyle: {
          objectId: 'title-text-box',
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 48, unit: 'PT' },
            bold: true,
          },
          fields: 'fontFamily,fontSize,bold',
        },
      },
      {
        createShape: {
          objectId: 'subtitle-text-box',
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: 'title-slide',
            size: {
              width: { magnitude: 600, unit: 'PT' },
              height: { magnitude: 100, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 60,
              translateY: 220,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: 'subtitle-text-box',
          text: `Pick up required\nPlease contact ${name} by ${contactType}: ${contactInfo}`,
        },
      },
      {
        updateTextStyle: {
          objectId: 'subtitle-text-box',
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 24, unit: 'PT' },
          },
          fields: 'fontFamily,fontSize',
        },
      },
      {
        updateParagraphStyle: {
          objectId: 'subtitle-text-box',
          style: {
            lineSpacing: 150,
          },
          fields: 'lineSpacing',
        },
      },
    ];

    await this.slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests,
      },
    });

    this.logger.log('Title slide added to the presentation');
  }

  private async createSlideForInventory(
    presentationId: string,
    inventory: any,
    index: number,
  ): Promise<void> {
    const requests = this.createSlideRequests(inventory, index);

    await this.slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests,
      },
    });

    this.logger.log(`Slide added for inventory: ${inventory.title}`);
  }

  private createSlideRequests(
    inventory: any,
    index: number,
  ): slides_v1.Schema$Request[] {
    const requests = [
      this.createSlideRequest(index),
      ...this.createTitleRequests(inventory.title, inventory.price, index),
      ...this.createImageRequests(inventory.image_url, index),
      ...this.createDescriptionRequests(inventory.description, index),
      ...this.createConditionRequests(inventory.condition, index),
    ];
    if (inventory.similar_url) {
      requests.push(
        ...this.createSimilarLinkRequests(inventory.similar_url, index),
      );
    }
    return requests;
  }

  private createSlideRequest(index: number): slides_v1.Schema$Request {
    return {
      createSlide: {
        objectId: `inventory-slide-${index}`,
        insertionIndex: index,
        slideLayoutReference: {
          predefinedLayout: 'BLANK',
        },
      },
    };
  }

  private createTitleRequests(
    title: string,
    price: number,
    index: number,
  ): slides_v1.Schema$Request[] {
    return [
      {
        createShape: {
          objectId: `title-${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: `inventory-slide-${index}`,
            size: {
              width: { magnitude: 650, unit: 'PT' },
              height: { magnitude: 50, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 40,
              translateY: 40,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: `title-${index}`,
          text: `${title} - $${price}`,
        },
      },
      {
        updateTextStyle: {
          objectId: `title-${index}`,
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 24, unit: 'PT' },
            bold: true,
          },
          fields: 'fontFamily,fontSize,bold',
        },
      },
    ];
  }

  private createImageRequests(
    imageUrl: string,
    index: number,
  ): slides_v1.Schema$Request[] {
    return [
      {
        createImage: {
          objectId: `inventory-image-${index}`,
          url: imageUrl,
          elementProperties: {
            pageObjectId: `inventory-slide-${index}`,
            size: {
              width: { magnitude: 300, unit: 'PT' },
              height: { magnitude: 300, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 40,
              translateY: 80,
              unit: 'PT',
            },
          },
        },
      },
    ];
  }

  private createDescriptionRequests(
    description: string,
    index: number,
  ): slides_v1.Schema$Request[] {
    return [
      {
        createShape: {
          objectId: `description-${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: `inventory-slide-${index}`,
            size: {
              width: { magnitude: 300, unit: 'PT' },
              height: { magnitude: 60, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 360,
              translateY: 90,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: `description-${index}`,
          text: `Description: ${description}`,
        },
      },
      {
        updateTextStyle: {
          objectId: `description-${index}`,
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 18, unit: 'PT' },
          },
          fields: 'fontFamily,fontSize',
        },
      },
    ];
  }

  private createConditionRequests(
    condition: string,
    index: number,
  ): slides_v1.Schema$Request[] {
    return [
      {
        createShape: {
          objectId: `condition-${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: `inventory-slide-${index}`,
            size: {
              width: { magnitude: 300, unit: 'PT' },
              height: { magnitude: 60, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 360,
              translateY: 180, // Adjusted Y position
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: `condition-${index}`,
          text: `Condition: ${condition}`,
        },
      },
      {
        updateTextStyle: {
          objectId: `condition-${index}`,
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 18, unit: 'PT' },
          },
          fields: 'fontFamily,fontSize',
        },
      },
    ];
  }

  private createSimilarLinkRequests(
    similarUrl: string,
    index: number,
  ): slides_v1.Schema$Request[] {
    return [
      {
        createShape: {
          objectId: `similar-link-${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: `inventory-slide-${index}`,
            size: {
              width: { magnitude: 300, unit: 'PT' },
              height: { magnitude: 60, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 360,
              translateY: 230, // Adjusted Y position
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: `similar-link-${index}`,
          text: `Similar: ${similarUrl}`,
        },
      },
      {
        updateTextStyle: {
          objectId: `similar-link-${index}`,
          style: {
            fontFamily: 'Arial',
            fontSize: { magnitude: 18, unit: 'PT' },
            link: {
              url: similarUrl,
            },
          },
          fields: 'fontFamily,fontSize,link',
        },
      },
    ];
  }

  private async setPresenterPermissions(
    presentationId: string,
    userEmail: string,
  ): Promise<void> {
    await this.drive.permissions.create({
      fileId: presentationId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: userEmail,
      },
      sendNotificationEmail: false,
    });

    await this.drive.permissions.create({
      fileId: presentationId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    this.logger.log(`Permissions set for presentation ${presentationId}`);
  }
}

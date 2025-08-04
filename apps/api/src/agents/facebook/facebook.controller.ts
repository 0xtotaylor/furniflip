import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SkipAuth } from '../../common/decorators';
import { FacebookService } from './facebook.service';

@Controller('agent/facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Post('/webhook')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any): Promise<string> {
    if (body.object !== 'page') {
      throw new NotFoundException('Invalid webhook event');
    }

    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      if (webhookEvent.message) {
        await this.facebookService.handleMessage(
          webhookEvent.sender.id,
          webhookEvent.recipient.id,
          webhookEvent.message,
          webhookEvent.referral ? webhookEvent.referral : undefined,
        );
      }
    }

    return 'EVENT_RECEIVED';
  }
}

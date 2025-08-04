import { Controller, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CraigslistService } from './craigslist.service';
import { SkipAuth } from '../../common/decorators';
import { Request } from 'express';

@Controller('agent/craigslist')
export class CraigslistController {
  constructor(private readonly craigslistService: CraigslistService) {}

  @Post('/email')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req: Request): Promise<void> {
    const { from, subject, text } = req.body;
    const isCraigslistEmail = from.includes('@sale.craigslist.org');

    if (isCraigslistEmail) {
      console.log(`Received Craigslist email forwarded to sales@furniflip.io`);
      console.log(`Original sender: ${from}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text}`);
    }
  }
}

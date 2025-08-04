import {
  Controller,
  Get,
  Post,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { SkipAuth } from '../common/decorators';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('/stripe/customer')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async handleStripeCustomer(@Req() req: Request) {
    if (
      !req.body.old_record.email_confirmed_at &&
      req.body.record.email_confirmed_at
    ) {
      return await this.profilesService.handleStripeCustomer(
        req.body.record.id,
        req.body.record.email,
      );
    }
  }

  @Post('/stripe/subscription')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async handleStripeSubscription(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.profilesService.handleStripeSubscription(req.body, signature);
  }

  @Get('/delete')
  @HttpCode(HttpStatus.OK)
  async handleDeleteUser(@Req() req: Request) {
    await this.profilesService.handleDeleteUser(req);
  }
}

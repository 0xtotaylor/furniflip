import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import * as Sentry from '@sentry/nestjs';
import { Supabase } from '../supabase';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class ProfilesService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY'));
  }

  async handleDeleteUser(req: Request): Promise<void> {
    const {
      data: { user },
    } = await this.supabase
      .getClient()
      .auth.getUser(ExtractJwt.fromAuthHeaderAsBearerToken()(req));
    await this.supabase.getClient().auth.admin.deleteUser(user.id);
  }

  async handleStripeCustomer(id: string, email: string): Promise<void> {
    const customer = await this.stripe.customers.create({
      name: id,
      email: email,
    });
    await this.supabase
      .getClient()
      .from('profiles')
      .update({ stripe_id: customer.id })
      .eq('id', id);
  }

  async handleStripeSubscription(
    rawBody: Buffer,
    signature: string,
  ): Promise<void> {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (error) {
      Sentry.captureException(error);
      this.logger.error(`Webhook Error: ${error instanceof Error ? error.message : String(error)}`);
      throw new HttpException(
        `Webhook Error: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data.object;
        await this.handleCustomerSubscriptionCreated(
          customerSubscriptionCreated,
        );
        break;
      case 'customer.subscription.deleted':
        const customerSubscriptionDeleted = event.data.object;
        await this.handleCustomerSubscriptionDeleted(
          customerSubscriptionDeleted,
        );
        break;
    }
  }

  private async handleCustomerSubscriptionCreated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const customerId = subscription.customer as string;
    const productId = subscription.items.data[0]?.price?.product as string;

    if (customerId && productId) {
      let tier: string | undefined;

      if (productId === 'prod_QhK4wHeIrT6DfS') {
        tier = 'Basic';
      } else if (productId === 'prod_QhK5VclE7R2W4S') {
        tier = 'Premium';
      }

      if (tier) {
        try {
          await this.supabase
            .getClient()
            .from('profiles')
            .update({ tier })
            .eq('stripe_id', customerId);
        } catch (error) {
          Sentry.captureException(error);
          this.logger.error(`Error updating profile tier: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        this.logger.warn(`Unrecognized product ID: ${productId}`);
      }
    } else {
      this.logger.warn(
        'No customer ID or product ID found in the Stripe subscription',
      );
    }
  }

  private async handleCustomerSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    this.logger.log(
      'Handling customer.subscription.deleted event',
      subscription,
    );
    // Implement your logic here
  }
}

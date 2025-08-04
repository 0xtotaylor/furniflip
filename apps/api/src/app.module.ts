import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@sentry/nestjs/setup';
import { SupabaseModule, SupabaseGuard } from './supabase';
import { ProfilesModule } from './profiles/profiles.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { InventoryModule } from './inventory/inventory.module';
import { FacebookModule } from './agents/facebook/facebook.module';
import { CraigslistModule } from './agents/craigslist/craigslist.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfilesModule,
    CatalogsModule,
    PassportModule,
    SupabaseModule,
    FacebookModule,
    InventoryModule,
    CraigslistModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}

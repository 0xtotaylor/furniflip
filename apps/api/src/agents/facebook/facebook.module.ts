import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';

import { SupabaseModule } from '../../supabase';

@Module({
  imports: [SupabaseModule, HttpModule],
  controllers: [FacebookController],
  providers: [FacebookService],
})
export class FacebookModule {}

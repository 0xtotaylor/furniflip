import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase';
import { CraigslistService } from './craigslist.service';
import { CraigslistController } from './craigslist.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [CraigslistController],
  providers: [CraigslistService],
})
export class CraigslistModule {}

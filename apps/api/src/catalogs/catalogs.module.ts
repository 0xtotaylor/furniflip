import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

import { SupabaseModule } from '../supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [],
  providers: [CatalogsService],
})
export class CatalogsModule {}

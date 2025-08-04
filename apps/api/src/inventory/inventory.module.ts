import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { CatalogsService } from 'src/catalogs/catalogs.service';

import { SupabaseModule } from '../supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [InventoryController],
  providers: [InventoryService, CatalogsService],
})
export class InventoryModule {}

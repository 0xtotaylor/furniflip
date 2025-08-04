import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Supabase } from '../../supabase';

@Injectable()
export class CraigslistService {
  private readonly logger = new Logger(CraigslistService.name);

  constructor(
    private readonly supabase: Supabase,
    private readonly configService: ConfigService,
  ) {}
}

import { Controller, Get, Query } from '@nestjs/common';
import { MarketQueryDto } from './dto/market-query.dto';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CoinRepository } from './entity/coin.repository';
import { Coin } from './entity/coin.entity';
import { CoinValueDto } from './dto/coin-value.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
  constructor(private coinRepository: CoinRepository) {}
}

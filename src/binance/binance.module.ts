import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceGateway } from './binance.gateway';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { HttpModule } from '@nestjs/axios';
import { CoinHistoryRepository } from 'src/market/entity/coinHistory.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CoinRepository,
      CoinHistoryRepository,
    ]),
    HttpModule.register({ timeout: 4000, maxRedirects: 4 }),
  ],
  providers: [BinanceService, BinanceGateway],
})
export class BinanceModule {}

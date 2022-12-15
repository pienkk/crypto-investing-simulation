import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CoinRepository } from './entity/coin.repository';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { CoinHistoryRepository } from './entity/coinHistory.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CoinRepository,
      CoinHistoryRepository,
    ]),
    HttpModule,
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}

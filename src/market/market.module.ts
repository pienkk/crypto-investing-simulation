import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CoinRepository } from './entity/coin.repository';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { CoinHistoryRepository } from './entity/coinHistory.repository';
import { MarketGateway } from './market.gateway';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CoinRepository,
      CoinHistoryRepository,
    ]),
  ],
  controllers: [MarketController],
  providers: [MarketService, MarketGateway],
})
export class MarketModule {}

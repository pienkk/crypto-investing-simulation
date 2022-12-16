import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceGateway } from './binance.gateway';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CoinRepository]), HttpModule],
  providers: [BinanceService, BinanceGateway],
})
export class BinanceModule {}

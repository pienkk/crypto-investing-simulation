import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { UserRepository } from 'src/user/entity/user.repository';
import { WalletRepository } from 'src/wallet/entity/wallet.repository';
import { TradeRepository } from './entity/trade.repository';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TradeRepository,
      WalletRepository,
      UserRepository,
      CoinRepository,
    ]),
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}

import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { UserRepository } from 'src/user/entity/user.repository';
import { WalletRepository } from './entity/wallet.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, WalletRepository]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}

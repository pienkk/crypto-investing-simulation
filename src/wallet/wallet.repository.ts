import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Trade } from 'src/trade/entity/trade.entity';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@CustomRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
  async getCoin(userId: number, coinId: number): Promise<Wallet> {
    return await this.findOneBy({ userId, coinId });
  }

  async insertCoin(tradeEntity: Trade) {
    const wallet = this.create({
      coinId: tradeEntity.coinId,
      userId: tradeEntity.userId,
      purchasePrice: tradeEntity.coin.price,
      quantity: tradeEntity.quantity,
    });
    this.save(wallet);
  }

  async updateCoin(tradeEntity: Trade, wallet: Wallet) {
    if (tradeEntity.isPurchase === 0) {
      wallet.purchasePrice =
        (tradeEntity.coin.price * tradeEntity.quantity +
          wallet.purchasePrice * wallet.quantity) /
        (tradeEntity.quantity + wallet.quantity);
      wallet.quantity += tradeEntity.quantity;
    }
    if (tradeEntity.isPurchase === 1) wallet.quantity -= tradeEntity.quantity;

    await this.update(wallet.id, {
      purchasePrice: wallet.purchasePrice,
      quantity: wallet.quantity,
    });
  }
}

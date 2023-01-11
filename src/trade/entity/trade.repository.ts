import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';

@CustomRepository(Trade)
export class TradeRepository extends Repository<Trade> {
  async getTradeAll(userId: number) {
    return await this.createQueryBuilder('trade')
      .innerJoinAndSelect('trade.coin', 'coin')
      .where('trade.userId = :userId', { userId })
      .getMany();
  }

  async coinConclusion() {
    return await this.createQueryBuilder('trade')
      .innerJoinAndSelect('trade.coin', 'coin')
      .where('trade.status = 0')
      .getMany();
  }

  async buyCoin(tradeId: number, price: number) {
    return await this.createQueryBuilder('trade')
      .update()
      .set({ status: 1, buyPrice: price })
      .where('id = :tradeId', { tradeId })
      .execute();
  }

  async sellCoin(trade: Trade, wallet: Wallet) {
    return await this.createQueryBuilder('trade')
      .update()
      .set({
        status: 1,
        sellPrice: trade.coin.price,
        gainMoney: (trade.coin.price - wallet.purchasePrice) * trade.quantity,
        gainPercent:
          (trade.coin.price - wallet.purchasePrice) / wallet.purchasePrice,
      })
      .where('id = :id', { id: trade.id })
      .execute();
  }
}

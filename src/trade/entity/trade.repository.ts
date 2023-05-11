import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
import { Repository } from 'typeorm';
import { TradeEntity } from './trade.entity';

@CustomRepository(TradeEntity)
export class TradeRepository extends Repository<TradeEntity> {
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

  async sellCoin(trade: TradeEntity, wallet: WalletEntity) {
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

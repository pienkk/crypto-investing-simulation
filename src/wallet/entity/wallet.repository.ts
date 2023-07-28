import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@CustomRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
  async getWallet(userId: number) {
    return await this.createQueryBuilder('w')
      .leftJoin('w.coin', 'coin')
      .select([
        'w.coinId',
        'coin.name',
        'coin.ticker',
        'coin.image',
        'w.purchasePrice',
        'w.quantity',
        'coin.price',
        '(coin.price - w.purchasePrice) / w.purchasePrice * 100 AS yieldPercent',
        '(coin.price - w.purchasePrice) * w.quantity AS yieldMoney',
      ])
      .where('userId = :userId', { userId })
      .getRawMany();
  }
}

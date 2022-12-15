import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CoinHistory } from './coinsHistory.entity';

@CustomRepository(CoinHistory)
export class CoinHistoryRepository extends Repository<CoinHistory> {
  async updateCoin(coinInfo: CoinHistory[]): Promise<void> {
    coinInfo.forEach(async (el) => {
      await this.update(el.id, el);
    });
  }
}

import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Coin } from './coin.entity';

@CustomRepository(Coin)
export class CoinRepository extends Repository<Coin> {
  async getCoinList(): Promise<Coin[]> {
    return await this.find();
  }

  async updateCoinByREST(coinInfo: Coin[]): Promise<void> {
    coinInfo.forEach(async (el) => {
      await this.createQueryBuilder()
        .update(Coin)
        .set(el)
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  async updateCoinByWS(coinInfo) {
    coinInfo.forEach(async (el) => {
      await this.createQueryBuilder()
        .update(Coin)
        .set({ price: el.curDayClose })
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }
}

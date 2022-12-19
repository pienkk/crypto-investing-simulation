import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MarketQueryDto } from '../dto/market-query.dto';
import { Coin } from './coin.entity';
import { CoinHistory } from './coinsHistory.entity';

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
        .set({ price: el.curDayClose, oneDayVolume: el.volumeQuote })
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  updateBeforePrice(beforePrice: CoinHistory[], hour: number) {
    beforePrice.forEach((el) => {
      const qb = this.createQueryBuilder().update();

      if (hour === 1) qb.set({ oneHourPrice: el.price });
      if (hour === 4) qb.set({ fourHourPrice: el.price });
      if (hour === 24) qb.set({ oneDayPrice: el.price });

      qb.where('symbol = :symbol', { symbol: el.symbol }).execute();
    });
  }

  async getMarketData({
    number = 50,
    page = 1,
    filter = 'ticker',
    order = 'ASC',
  }: MarketQueryDto) {
    const qb = await this.createQueryBuilder('c')
      .select([
        'c.id',
        'c.name',
        'c.ticker',
        'c.image',
        'c.symbol',
        'c.price',
        '((c.price - c.oneHourPrice) / c.oneHourPrice * 100) AS oneHourDiff',
        '(c.price - c.fourHourPrice) / c.fourHourPrice * 100 AS fourHourDiff',
        '(c.price - c.oneDayPrice) / c.oneDayPrice * 100 AS oneDayDiff',
        'c.oneDayVolume',
        'c.price * c.quantity AS c_marketCap',
      ])
      .take(number)
      .skip(page - 1);
    if (order === 'DESC') qb.orderBy({ [filter]: 'DESC' });
    if (order === 'ASC') qb.orderBy({ [filter]: 'ASC' });
    return qb.getRawMany();
  }
}

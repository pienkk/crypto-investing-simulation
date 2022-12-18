import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MarketQueryDto } from '../dto/market-query.dto';
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
        .set({ price: el.curDayClose, oneDayVolume: el.volumeQuote })
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  async getMarketData({ number, page, filter, order }: MarketQueryDto) {
    const qb = await this.createQueryBuilder('c')
      .select([
        'c.id',
        'c.name',
        'c.ticker',
        'c.image',
        'c.symbol',
        'c.price',
        '(c.price - oneHourPrice) / oneHourPrice * 100 AS oneHourDiff',
        '(c.price - fourHourPrice) / fourHourPrice * 100 AS fourHourDiff',
        '(c.price - oneDayPrice) / oneDayPrice * 100 AS oneDayDiff',
        'oneDayVolume',
        'price * quantity AS marketCap',
      ])
      .take(number)
      .skip(page - 1);
    if (order === 'DESC') qb.orderBy({ [filter]: 'DESC' });
    if (order === 'ASC') qb.orderBy({ [filter]: 'ASC' });
    return qb.getManyAndCount();
    // if (filter === 'name') qb.orderBy({[filter]: 'DESC' });
    // if (filter === 'price') qb.orderBy({ 'c.price': order });
    // if(filter === )
  }
}

import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MarketQueryDto } from '../dto/market-query.dto';
import { Coin } from './coin.entity';
import { CoinHistory } from './coinHistory.entity';

@CustomRepository(Coin)
export class CoinRepository extends Repository<Coin> {
  async getCoinList(): Promise<Coin[]> {
    return await this.find();
  }

  async getAmountByTrade(userId: number, symbol: string) {
    return await this.createQueryBuilder('c')
      .leftJoinAndSelect('c.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('symbol = :symbol', { symbol })
      .andWhere('user.id = :userId', { userId })
      .getOne();
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
        .set({
          price: el.curDayClose,
          oneDayPrice: el.open,
          oneDayVolume: el.volumeQuote,
        })
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  updateBeforePrice(beforePrice: CoinHistory[], hour: number) {
    beforePrice.forEach((el) => {
      const qb = this.createQueryBuilder().update();

      if (hour === 1) qb.set({ oneHourPrice: el.price });
      if (hour === 4) qb.set({ fourHourPrice: el.price });

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

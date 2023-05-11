import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MarketQueryDto } from '../dto/market-query.dto';
import { CoinEntity } from './coin.entity';
import { CoinHistoryEntity } from './coinHistory.entity';

@CustomRepository(CoinEntity)
export class CoinRepository extends Repository<CoinEntity> {
  async getCoinList(): Promise<CoinEntity[]> {
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

  async updateCoinByREST(coinInfo: CoinEntity[]): Promise<void> {
    coinInfo.forEach(async (el) => {
      await this.createQueryBuilder()
        .update(CoinEntity)
        .set(el)
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  async updateCoinByWS(coinInfo) {
    coinInfo.forEach(async (el) => {
      await this.createQueryBuilder()
        .update(CoinEntity)
        .set({
          price: el.curDayClose,
          oneDayPrice: el.open,
          oneDayVolume: el.volumeQuote,
        })
        .where('symbol = :symbol', { symbol: el.symbol })
        .execute();
    });
  }

  updateBeforePrice(beforePrice: CoinHistoryEntity[], hour: number) {
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
    const qb = this.createQueryBuilder('c')
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
    return await qb.getRawMany();
  }
}

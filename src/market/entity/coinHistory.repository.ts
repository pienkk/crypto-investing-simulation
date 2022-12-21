import { symbol } from 'joi';
import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CoinHistory } from './coinHistory.entity';

@CustomRepository(CoinHistory)
export class CoinHistoryRepository extends Repository<CoinHistory> {
  async insertCoinHistoriesByWS(coinInfo) {
    const bulk = coinInfo.map((el) => {
      return this.create({
        symbol: el.symbol,
        price: el.curDayClose,
        eventTime: el.eventTime / 1000,
      });
    });

    this.save(bulk);
  }

  async getBeforePrice(eventTime: number) {
    return await this.createQueryBuilder('ch')
      .select('symbol')
      .addSelect('AVG(price)', 'price')
      .where('eventTime = :eventTime', { eventTime })
      .groupBy('symbol')
      .getRawMany();
  }

  async removeBeforePrice(eventTime: number) {
    this.createQueryBuilder()
      .delete()
      .from('coinHistories')
      .where('eventTime < :eventTime', { eventTime })
      .execute();
  }
}

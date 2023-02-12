import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async updateMoney(userMoney: number, userId: number) {
    return await this.createQueryBuilder('u')
      .update()
      .set({ money: () => `money + ${userMoney}` })
      .where('id = :id', { id: userId })
      .execute();
  }

  async getWallet(userId: number) {
    return await this.createQueryBuilder('u')
      .leftJoin('u.wallet', 'w')
      .innerJoin('w.coin', 'c')
      .select([
        'u.nickname',
        'u.money',
        '(SUM(c.price * w.quantity) + u.money - 1000000) / 10000  AS totalYeildPercent',
        '(SUM(c.price * w.quantity) + u.money - 1000000) AS totalYeildMoney',
      ])
      .where('u.id = :userId', { userId })
      .getRawOne();
  }

  // async getMoneyRank() {
  //   return await this.createQueryBuilder('u')
  //     .leftJoin('u.wallet', 'w')
  //     .leftJoin('w.coin', 'c')
  //     .select([
  //       'u.ID',
  //       'u.nickName',
  //       '(SUM (c.price * w.quantity) + u.money) AS totalMoney',
  //       '(SUM (c.price * w.quantity) + u.money ) / 10000 AS yieldPercent',
  //       'rank() over (order by ((c.price * w.quantity) + u.money) desc) as ranking',
  //     ])
  //     // .where('w.id != null')
  //     .groupBy('u.ID')
  //     // .addGroupBy('u.nickName')
  //     .orderBy('ranking', 'DESC')
  //     .take(10)
  //     .getRawMany();
  // }
  async getMoneyRank() {
    return await this.createQueryBuilder('u')
      .leftJoin('u.wallet', 'w')
      .leftJoin('w.coin', 'c')
      .select([
        'u.id as id',
        'u.nickname as nickname',
        'u.money AS totalMoney',
        'u.money / 10000 AS yieldPercent',
        'rank() over (order by u.money desc) as ranking',
      ])
      .groupBy('u.ID')
      .orderBy('ranking', 'ASC')
      .take(10)
      .getRawMany();
  }

  async getRankByUser(userId: number) {
    return await this.createQueryBuilder('user')
      .leftJoin('user.wallet', 'wallet')
      .leftJoin('wallet.coin', 'coin')
      .select([
        'user.id AS id',
        'user.nickname AS nickname',
        'user.money AS totalMoney',
        'user.money / 10000 AS yieldPercent',
        'rank() over (order by user.money desc) as ranking',
      ])
      .groupBy('user.id')
      .orderBy('ranking', 'ASC')
      .getRawOne();
  }

  async getIncomeRank(order: string) {
    return await this.createQueryBuilder('u')
      .leftJoin('u.trade', 'th')
      .select([
        'u.id as id',
        'u.nickname as nickname',
        'SUM(th.sellPrice * th.quantity) - SUM(th.buyPrice * th.quantity) AS incomeMoney',
        '(SUM(th.sellPrice * th.quantity) - SUM(th.buyPrice * th.quantity)) / SUM(th.buyPrice * th.quantity) * 100 AS incomePercent',
        'rank() over (order by (SUM(th.sellPrice * th.quantity) - SUM(th.buyPrice * th.quantity)) desc) as ranking ',
      ])
      .where('th.status = 1')
      .groupBy('th.userId')
      .orderBy(order, 'DESC')
      .take(10)
      .getRawMany();
  }
}

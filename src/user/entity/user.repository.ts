import { userInfo } from 'os';
import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Trade } from 'src/trade/entity/trade.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async getOne(id: number) {
    return await this.findOneBy({ id });
  }

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
}

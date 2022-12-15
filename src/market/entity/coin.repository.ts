import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Coin } from './coin.entity';

@CustomRepository(Coin)
export class CoinRepository extends Repository<Coin> {
  async getCoinList(): Promise<Coin[]> {
    return await this.find();
  }
}

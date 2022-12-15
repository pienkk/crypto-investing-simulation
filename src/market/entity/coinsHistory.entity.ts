import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coin } from './coin.entity';

@Entity('coinPriceHistories')
export class CoinHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  oneHourPrice: number;

  @Column()
  fourHourPrice: number;

  @Column()
  oneDayPrice: number;

  @Column()
  oneDayVolum: number;

  @Column()
  quantity: number;

  @OneToOne(() => Coin)
  @JoinColumn()
  coin: Coin;
}

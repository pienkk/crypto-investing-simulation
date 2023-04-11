import { ColumnTransform } from 'src/config/database/columnTrans';
import { Coin } from 'src/market/entity/coin.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '지갑 id',
  })
  id: number;

  @Column({
    type: 'int',
    comment: '코인 id',
    name: 'coin_id',
  })
  coinId: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  userId: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  purchasePrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  quantity: number;

  @ManyToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Coin, (coin) => coin.wallet)
  @JoinColumn({ name: 'coinId' })
  coin: Coin;
}

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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coinId: number;

  @Column()
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

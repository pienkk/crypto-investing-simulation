import { ColumnTransform } from 'src/config/database/columnTrans';
import { Trade } from 'src/trade/entity/trade.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('coins')
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  symbol: string;

  @Column()
  image: string;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  price: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  oneHourPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  fourHourPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  oneDayPrice: number;

  @Column('decimal', {
    precision: 20,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  oneDayVolume: number;

  @Column('decimal', {
    precision: 20,
    scale: 6,
    transformer: new ColumnTransform(),
  })
  quantity: number;

  @OneToOne(() => Trade, (trade) => trade.coin)
  trade: Trade;

  @OneToMany(() => Wallet, (wallet) => wallet.coin)
  wallet: Wallet[];
}

import { ColumnTransform } from 'src/config/database/columnTrans';
import { Coin } from 'src/market/entity/coin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseStatus, TradeStatus } from '../enum/trade.status.enum';

@Entity('tradeHistories')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  coinId: number;

  @Column({ enum: PurchaseStatus })
  isPurchase: PurchaseStatus;

  @Column({ enum: TradeStatus })
  status: TradeStatus;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  quantity: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  buyPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  sellPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  fee: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  gainMoney: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  gainPercent: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Coin, (coin) => coin.trade)
  @JoinColumn()
  coin: Coin;
}

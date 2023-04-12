import { ApiProperty } from '@nestjs/swagger';
import { ColumnTransform } from 'src/config/database/columnTrans';
import { Coin } from 'src/market/entity/coin.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseStatus, TradeStatus } from '../enum/trade.status.enum';

@Entity('tradeHistories')
export class Trade {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '거래 내역 id',
  })
  @ApiProperty({ description: '거래 내역 id' })
  id: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column({
    type: 'int',
    comment: '코인 id',
    name: 'coin_id',
  })
  @ApiProperty({ description: '코인 id' })
  coinId: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    name: 'is_purchase',
    comment: '구매/판매여부',
  })
  @ApiProperty({ description: '구매 / 판매 여부' })
  isPurchase: PurchaseStatus;

  @Column({ type: 'enum', enum: TradeStatus, comment: '거래 상태' })
  @ApiProperty({ description: '거래 상태 정보' })
  status: TradeStatus;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '거래 수량' })
  quantity: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
    nullable: true,
  })
  @ApiProperty({ description: '구매 금액' })
  buyPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
    nullable: true,
  })
  @ApiProperty({ description: '판매 금액' })
  sellPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
    nullable: true,
  })
  @ApiProperty({ description: '수수료' })
  fee: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
    nullable: true,
  })
  @ApiProperty({ description: '순수익' })
  gainMoney: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
    nullable: true,
  })
  @ApiProperty({ description: '순수익 률' })
  gainPercent: number;

  @CreateDateColumn()
  @ApiProperty({ description: '거래 일자' })
  created_at: Date;

  @OneToOne(() => Coin, (coin) => coin.trade)
  @JoinColumn({ name: 'coin_id' })
  coin: Coin;

  @ManyToOne(() => User, (user) => user.trade)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

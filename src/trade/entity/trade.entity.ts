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
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '거래 내역 id' })
  id: number;

  @Column()
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column()
  @ApiProperty({ description: '코인 id' })
  coinId: number;

  @Column({ enum: PurchaseStatus })
  @ApiProperty({ description: '구매 / 판매 여부' })
  isPurchase: PurchaseStatus;

  @Column({ enum: TradeStatus })
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
  })
  @ApiProperty({ description: '구매 금액' })
  buyPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '판매 금액' })
  sellPrice: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '수수료' })
  fee: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '순수익' })
  gainMoney: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '순수익 률' })
  gainPercent: number;

  @CreateDateColumn()
  @ApiProperty({ description: '거래 일자' })
  created_at: Date;

  @OneToOne(() => Coin, (coin) => coin.trade)
  @JoinColumn()
  coin: Coin;

  @ManyToOne(() => User, (user) => user.trade)
  @JoinColumn({ name: 'userId' })
  user: User;
}

import { ApiProperty } from '@nestjs/swagger';
import { ColumnTransform } from 'src/config/database/columnTrans';
import { Trade } from 'src/trade/entity/trade.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('coins')
export class Coin {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '코인 id',
  })
  @ApiProperty({ description: '코인 id' })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '코인 이름',
  })
  @ApiProperty({ description: '코인 이름' })
  name: string;

  @Column({
    type: 'varchar',
    length: 10,
    comment: '코인 티커',
  })
  @ApiProperty({ description: '코인 티커' })
  ticker: string;

  @Column({
    type: 'varchar',
    length: 10,
    comment: '코인 심볼',
  })
  @ApiProperty({ description: '코인 심볼' })
  symbol: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '코인 이미지',
  })
  @ApiProperty({ description: '코인 이미지' })
  image: string;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  @ApiProperty({ description: '코인 가격' })
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

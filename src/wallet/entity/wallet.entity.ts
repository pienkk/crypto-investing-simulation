import { ColumnTransform } from 'src/config/database/columnTrans';
import { CoinEntity } from 'src/market/entity/coin.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wallets')
export class WalletEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CoinEntity, (coin) => coin.wallet)
  @JoinColumn({ name: 'coin_id' })
  coin: CoinEntity;
}

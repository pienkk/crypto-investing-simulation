import { ColumnTransform } from 'src/config/database/columnTrans';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coinHistories')
export class CoinHistoryEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '코인 히스토리 id',
  })
  id: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  price: number;

  @Column({
    type: 'int',
    comment: '코인 심볼',
  })
  symbol: string;

  @Column({
    type: 'int',
    comment: '이벤트 시간',
  })
  eventTime: number;
}

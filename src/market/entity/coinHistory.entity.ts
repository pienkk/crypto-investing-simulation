import { ColumnTransform } from 'src/config/database/columnTrans';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coinHistories')
export class CoinHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  price: number;

  @Column()
  symbol: string;

  @Column()
  eventTime: number;
}

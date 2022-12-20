import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coinHistories')
export class CoinHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  symbol: string;

  @Column()
  eventTime: number;
}

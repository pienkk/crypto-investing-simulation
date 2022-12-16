import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  price: number;

  @Column()
  oneHourPrice: number;

  @Column()
  fourHourPrice: number;

  @Column()
  oneDayPrice: number;

  @Column()
  oneDayVolume: number;

  @Column()
  quantity: number;
}

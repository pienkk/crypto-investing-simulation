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
}

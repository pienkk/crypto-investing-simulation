import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reply } from './reply.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  userId: number;
}

export class PostDetail extends Posts {
  @OneToMany(() => Reply, (reply) => reply.post, { eager: true })
  reply: Reply[];
}

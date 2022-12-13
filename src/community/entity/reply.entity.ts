import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('replies')
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => Posts)
  @JoinColumn({ name: 'postId' })
  post: Posts;
}

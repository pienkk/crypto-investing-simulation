import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Posts, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Posts;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: 'userId' })
  user: User;
}

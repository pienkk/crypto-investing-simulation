import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '댓글 id' })
  id: number;

  @Column()
  @ApiProperty({ description: '댓글 코멘트' })
  comment: string;

  @Column()
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column()
  @ApiProperty({ description: '게시글 id' })
  postId: number;

  @CreateDateColumn()
  @ApiProperty({ description: ' 댓글 생성 시간' })
  created_at: Date;

  @ManyToOne(() => Posts, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Posts;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: 'userId' })
  user: User;
}

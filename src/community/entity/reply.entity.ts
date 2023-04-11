import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('replies')
export class Reply {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '댓글 id',
  })
  @ApiProperty({ description: '댓글 id' })
  id: number;

  @Column({
    type: 'varchar',
    length: 1000,
    comment: '댓글 코멘트',
  })
  @ApiProperty({ description: '댓글 코멘트' })
  comment: string;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column({
    type: 'int',
    comment: '게시글 id',
    name: 'post_id',
  })
  @ApiProperty({ description: '게시글 id' })
  postId: number;

  @Column({
    type: 'int',
    comment: '부모 댓글 id',
    name: 'reply_id',
  })
  @ApiProperty({ description: '부모 댓글 id' })
  replyId: number;

  @CreateDateColumn()
  @ApiProperty({ description: '댓글 생성 시간' })
  created_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '댓글 삭제 시간' })
  deleted_at: Date;

  @ManyToOne(() => Posts, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Posts;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: 'userId' })
  user: User;

  static of(params: Partial<Reply>): Reply {
    const reply = new Reply();
    Object.assign(reply, params);

    return reply;
  }
}

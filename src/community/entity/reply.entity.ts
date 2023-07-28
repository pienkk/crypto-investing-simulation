import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('replies')
export class ReplyEntity {
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
    nullable: true,
  })
  @ApiProperty({ description: '부모 댓글 id' })
  replyId: number;

  @CreateDateColumn()
  @ApiProperty({ description: '댓글 생성 시간' })
  created_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '댓글 삭제 시간' })
  deleted_at: Date;

  @ManyToOne(() => PostEntity, (post) => post.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.replies)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  static of(params: Partial<ReplyEntity>): ReplyEntity {
    const reply = new ReplyEntity();
    Object.assign(reply, params);

    return reply;
  }
}

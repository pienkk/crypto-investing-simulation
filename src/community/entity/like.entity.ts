import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('likes')
export class Likes {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '좋아요 id',
  })
  @ApiProperty({ description: '좋아요 id' })
  id: number;

  @Column({
    type: 'int',
    comment: '게시글 id',
    name: 'post_id',
  })
  @ApiProperty({ description: '게시글 id' })
  postId: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  @ApiProperty({ description: '유저id' })
  userId: number;

  @Column()
  @ApiProperty({
    description: '좋아요/ 싫어요 ex) true = 좋아요 , false = 싫어요',
    default: true,
  })
  isLike: boolean;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Posts, (posts) => posts.likes)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  static of(params: Partial<Likes>): Likes {
    const like = new Likes();
    Object.assign(like, params);

    return like;
  }
}

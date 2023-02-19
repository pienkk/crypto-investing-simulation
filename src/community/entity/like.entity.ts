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

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '좋아요 id' })
  id: number;

  @Column()
  @ApiProperty({ description: '게시글 id' })
  postId: number;

  @Column()
  @ApiProperty({ description: '유저id' })
  userId: number;

  @Column()
  @ApiProperty({
    description: '좋아요/ 싫어요 ex) true = 좋아요 , false = 싫어요',
  })
  isLike: boolean;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Posts, (posts) => posts.likes)
  @JoinColumn({ name: 'postId' })
  post: Posts;

  static of(params: Partial<Likes>): Likes {
    const like = new Likes();
    Object.assign(like, params);

    return like;
  }
}

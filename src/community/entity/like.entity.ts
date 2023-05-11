import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('likes')
export class LikeEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (posts) => posts.likes)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  static of(params: Partial<LikeEntity>): LikeEntity {
    const like = new LikeEntity();
    Object.assign(like, params);

    return like;
  }
}

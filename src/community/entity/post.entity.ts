import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeEntity } from './like.entity';
import { ReplyEntity } from './reply.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '게시글 id',
  })
  @ApiProperty({ description: '게시글 id' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '게시글 제목',
  })
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @Column({ type: 'varchar', length: 3000, comment: '게시글 내용' })
  @ApiProperty({ description: '게시글 내용' })
  description: string;

  @Column({
    type: 'int',
    default: 0,
    comment: '조회수',
  })
  @ApiProperty({ description: '조회수' })
  hits: number;

  @Column({
    type: 'int',
    comment: '카테고리 id',
    name: 'category_id',
  })
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: '게시 여부',
  })
  @ApiProperty({ description: '게시 여부' })
  isPublished: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '게시글 생성 시간' })
  created_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '게시글 삭제 시간' })
  deleted_at: Date;

  @OneToMany(() => ReplyEntity, (reply) => reply.post, { cascade: true })
  replies: ReplyEntity[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => LikeEntity, (likes) => likes.post)
  likes: LikeEntity[];

  static of(params: Partial<PostEntity>): PostEntity {
    const post = new PostEntity();
    Object.assign(post, params);

    return post;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reply } from './reply.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '게시글 id' })
  id: number;

  @Column()
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @Column()
  @ApiProperty({ description: '게시글 내용' })
  description: string;

  @Column()
  @ApiProperty({ description: '조회수' })
  hits: number;

  @Column()
  @ApiProperty({ description: '카테고리' })
  label: string;

  @Column()
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @CreateDateColumn()
  @ApiProperty({ description: '게시글 생성 시간' })
  created_at: Date;

  @Column()
  @ApiProperty({ description: '게시글 삭제 시간' })
  deleted_at: Date;

  @OneToMany(() => Reply, (reply) => reply.post, { cascade: true })
  replies: Reply[];

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: User;

  static of(params: Partial<Posts>): Posts {
    const post = new Posts();
    Object.assign(post, params);

    return post;
  }
}

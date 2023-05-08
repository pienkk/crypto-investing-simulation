import { Likes } from 'src/community/entity/like.entity';
import { Posts } from 'src/community/entity/post.entity';
import { Reply } from 'src/community/entity/reply.entity';
import { ColumnTransform } from 'src/config/database/columnTrans';
import { Trade } from 'src/trade/entity/trade.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '유저 id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '유저 닉네임',
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '유저 자기소개',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '유저 이메일',
  })
  email: string;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    default: 10000000,
    transformer: new ColumnTransform(),
  })
  money: number;

  @Column({
    type: 'varchar',
    comment: '프로필 이미지',
    name: 'profile_image',
  })
  profileImage: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '생성일',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '수정일',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    comment: '삭제일',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet[];

  @OneToMany(() => Trade, (trade) => trade.user)
  trade: Trade[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  static of(params: Partial<User>): User {
    const user = new User();
    Object.assign(user, params);

    return user;
  }
}

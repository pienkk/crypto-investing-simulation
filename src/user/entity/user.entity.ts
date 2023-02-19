import { Exclude } from 'class-transformer';
import { Likes } from 'src/community/entity/like.entity';
import { Posts } from 'src/community/entity/post.entity';
import { Reply } from 'src/community/entity/reply.entity';
import { ColumnTransform } from 'src/config/database/columnTrans';
import { Trade } from 'src/trade/entity/trade.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  @Exclude()
  email: string;

  @Column('decimal', {
    precision: 15,
    scale: 7,
    transformer: new ColumnTransform(),
  })
  money: number;

  @OneToMany(() => Posts, (post) => post.user)
  post: Posts[];

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

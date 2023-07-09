import { ChatParticipantEntity } from 'src/chat-room/entity/chat_participant.entity';
import { ChatEntity } from 'src/chat/entity/chat.entity';
import { UserReadChatEntity } from 'src/chat/entity/user-read-chat.entity';
import { LikeEntity } from 'src/community/entity/like.entity';
import { PostEntity } from 'src/community/entity/post.entity';
import { ReplyEntity } from 'src/community/entity/reply.entity';
import { ColumnTransform } from 'src/config/database/columnTrans';
import { TradeEntity } from 'src/trade/entity/trade.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
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

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => ReplyEntity, (reply) => reply.user)
  replies: ReplyEntity[];

  @OneToMany(() => WalletEntity, (wallet) => wallet.user)
  wallet: WalletEntity[];

  @OneToMany(() => TradeEntity, (trade) => trade.user)
  trade: TradeEntity[];

  @OneToMany(() => LikeEntity, (likes) => likes.user)
  likes: LikeEntity[];

  @OneToMany(
    () => ChatParticipantEntity,
    (chatParticipant) => chatParticipant.user,
  )
  chatParticipants: ChatParticipantEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chats: ChatEntity[];

  @OneToMany(() => UserReadChatEntity, (userReadChat) => userReadChat.user)
  userReadChats: UserReadChatEntity[];

  static of(params: Partial<UserEntity>): UserEntity {
    const user = new UserEntity();
    Object.assign(user, params);

    return user;
  }
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity('user-read-chats')
export class UserReadChatEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '유저가 읽은 채팅 id',
  })
  id: number;

  @Column({
    type: 'int',
    comment: '채팅 id',
    name: 'chat_id',
  })
  chatId: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => ChatEntity, (chat) => chat.userReadChats)
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.userReadChats)
  user: UserEntity;
}

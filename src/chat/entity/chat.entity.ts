import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomEntity } from 'src/chat-room/entity/chat-room.entity';
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
  UpdateDateColumn,
} from 'typeorm';
import { UserReadChatEntity } from './user-read-chat.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '채팅 id',
  })
  @ApiProperty({ description: '채팅 id' })
  id: number;

  @Column({
    type: 'int',
    comment: '채팅방 id',
    name: 'chat_room_id',
  })
  @ApiProperty({ description: '채팅방 id' })
  chatRoomId: number;

  @Column({
    type: 'int',
    comment: '유저 id',
    name: 'user_id',
  })
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Column({
    type: 'varchar',
    comment: '채팅 내용',
  })
  @ApiProperty({ description: '채팅 내용' })
  content: string;

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

  @ManyToOne(() => UserEntity, (user) => user.chats)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.chats)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoomEntity;

  @OneToMany(() => UserReadChatEntity, (userReadChat) => userReadChat.chat)
  userReadChats: UserReadChatEntity[];
}

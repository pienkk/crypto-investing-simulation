import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoomEntity } from './chat-room.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity('chat-participants')
export class ChatParticipantEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '채팅방 참여자 id',
  })
  @ApiProperty({ description: '채팅방 참여자 id' })
  id: number;

  @Column({
    type: 'boolean',
    comment: '채팅방 나간 여부',
    name: 'is_exit',
    default: false,
  })
  @ApiProperty({ description: '채팅방 나간 여부' })
  isExit: boolean;

  @Column({
    comment: '채팅방 입장 시간',
    name: 'join_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ description: '채팅방 입장 시간' })
  joinTime: Date;

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

  @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.chatParticipants)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.chatParticipants)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

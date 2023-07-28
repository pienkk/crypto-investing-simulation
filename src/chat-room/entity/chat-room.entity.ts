import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatParticipantEntity } from './chat_participant.entity';
import { ChatEntity } from 'src/chat/entity/chat.entity';

@Entity('chat-rooms')
export class ChatRoomEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '채팅방 id',
  })
  @ApiProperty({ description: '채팅방 id' })
  id: number;

  @OneToMany(
    () => ChatParticipantEntity,
    (chatParticipant) => chatParticipant.chatRoom,
  )
  chatParticipants: ChatParticipantEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.chatRoom)
  chats: ChatEntity[];
}

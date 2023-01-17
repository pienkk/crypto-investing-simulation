import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Reply } from '../entity/reply.entity';

export class ResponseReplyDto {
  @IsNumber()
  @ApiProperty({ description: '댓글id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '코멘트' })
  private comment: string;

  @IsDate()
  @ApiProperty({ description: '작성 날짜' })
  private created_at: Date;

  @ApiProperty({ description: '유저 정보' })
  private user: ResponseUserDto;

  static fromEntity(entity: Reply): ResponseReplyDto {
    const dto = new ResponseReplyDto();
    dto.id = entity.id;
    dto.comment = entity.comment;
    dto.created_at = entity.created_at;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;
    return dto;
  }

  static fromEntities(entities: Reply[]): ResponseReplyDto[] {
    return entities.map((entity) => ResponseReplyDto.fromEntity(entity));
  }
}

export class ReplyListDto {
  readonly reply: ResponseReplyDto[];

  @IsNumber()
  readonly number: number;
}

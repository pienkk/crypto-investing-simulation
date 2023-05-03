import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Reply } from '../entity/reply.entity';
import { ResponsePostDto } from './Response-post.dto';

// 댓글 응답 DTO
export class ResponseReplyDto {
  @IsNumber()
  @ApiProperty({ description: '댓글id', example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ description: '코멘트', example: '댓글입니다.' })
  comment: string;

  @IsNumber()
  @ApiProperty({ description: '부모 댓글id', example: 1 })
  replyId: number;

  @IsDate()
  @ApiProperty({
    description: '작성 날짜',
    example: '2021-08-31T15:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({ description: '삭제 시간', example: null })
  deleted_at: Date;

  @ApiProperty({ description: '유저 정보' })
  user: ResponseUserDto;

  static fromEntity(entity: Reply): ResponseReplyDto {
    const dto = new ResponseReplyDto();
    dto.id = entity.id;
    dto.comment = entity.comment;
    dto.replyId = entity.replyId;
    dto.created_at = entity.created_at;
    dto.deleted_at = entity.deleted_at;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;

    return dto;
  }

  static fromEntities(entities: Reply[]): ResponseReplyDto[] {
    return entities.map((entity) => ResponseReplyDto.fromEntity(entity));
  }
}

/**
 * 유저 작성 댓글 응답 DTO
 */
export class ResponseReplyByUserDto extends ResponseReplyDto {
  @ApiProperty({ description: '게시글 정보' })
  post: ResponsePostDto;

  static fromEntity(entity: Reply): ResponseReplyByUserDto {
    const dto = new ResponseReplyByUserDto();
    dto.id = entity.id;
    dto.comment = entity.comment;
    dto.replyId = entity.replyId;
    dto.created_at = entity.created_at;
    dto.deleted_at = entity.deleted_at;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;

    const post = ResponsePostDto.fromEntity(entity.post);
    dto.post = post;

    return dto;
  }

  static fromEntities(entities: Reply[]): ResponseReplyByUserDto[] {
    return entities.map((entity) => ResponseReplyByUserDto.fromEntity(entity));
  }
}

// 댓글 페이지네이션 응답 DTO
export class ResponseReplyByUserPageNationDto {
  @ApiProperty({ type: [ResponseReplyByUserDto] })
  readonly replies: ResponseReplyByUserDto[];

  @ApiProperty({ description: '총 댓글 수' })
  readonly number: number;
}

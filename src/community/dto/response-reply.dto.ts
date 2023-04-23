import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Reply } from '../entity/reply.entity';
import { ResponsePostsDto } from './response-post.dto';

export class ResponseReplyDto {
  @IsNumber()
  @ApiProperty({ description: '댓글id' })
  id: number;

  @IsString()
  @ApiProperty({ description: '코멘트' })
  comment: string;

  @IsNumber()
  @ApiProperty({ description: '부모 댓글id' })
  replyId: number;

  @IsDate()
  @ApiProperty({ description: '작성 날짜' })
  created_at: Date;

  @ApiProperty({ description: '삭제 시간' })
  deleted_at: Date;

  @ApiProperty({ description: '게시글 정보' })
  post: ResponsePostsDto;

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

    if (entity.post) {
      const post = ResponsePostsDto.fromEntity(entity.post);
      dto.post = post;
    }
    return dto;
  }

  static fromEntities(entities: Reply[]): ResponseReplyDto[] {
    return entities.map((entity) => ResponseReplyDto.fromEntity(entity));
  }
}

export class ReplyListDto {
  @ApiProperty({ type: [ResponseReplyDto] })
  readonly replies: ResponseReplyDto[];

  @ApiProperty({ description: '총 댓글 수' })
  readonly number: number;
}

export class ResponseUserReplyDto {
  @IsNumber()
  @ApiProperty({ description: '댓글id' })
  id: number;

  @IsString()
  @ApiProperty({ description: '코멘트' })
  comment: string;

  @IsNumber()
  @ApiProperty({ description: '부모 댓글id' })
  replyId: number;

  @IsDate()
  @ApiProperty({ description: '작성 날짜' })
  created_at: Date;

  @ApiProperty({ description: '게시글 정보' })
  post: ResponsePostsDto;

  @ApiProperty({ description: '유저 정보' })
  user: ResponseUserDto;
}

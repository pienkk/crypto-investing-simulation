import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Posts } from '../entity/post.entity';
import { ResponseReplyDto } from './response-reply.dto';
export class ResponsePostsDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 Id' })
  id: number;

  @IsString()
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '게시글 내용' })
  description: string;

  @IsNumber()
  @ApiProperty({ description: '게시글 조회수' })
  hits: number;

  @IsString()
  @ApiProperty({ description: '게시글 카테고리' })
  label: string;

  @IsDate()
  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @IsNumber()
  @ApiProperty({ description: '댓글 수' })
  repliesCount: number;

  @ApiProperty()
  user: ResponseUserDto;

  static fromEntity(entity: Posts): ResponsePostsDto {
    const dto = new ResponsePostsDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.created_at = entity.created_at;
    dto.hits = entity.hits;
    dto.label = entity.label;
    dto.repliesCount = entity.replies.length;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;

    return dto;
  }

  static fromEntities(entities: Posts[]): ResponsePostsDto[] {
    return entities.map((entity) => ResponsePostsDto.fromEntity(entity));
  }

  static hitsPlus(entity: ResponsePostsDto) {
    entity.hits += 1;
    return entity;
  }
}

export class PostListDto {
  @ApiProperty({ type: [ResponsePostsDto] })
  readonly post: ResponsePostsDto[];

  @IsNumber()
  @ApiProperty()
  readonly number: number;
}

export class PostDetailDto {
  @ApiProperty()
  readonly post: ResponsePostsDto;

  @ApiProperty({ type: [ResponseReplyDto] })
  readonly reply: ResponseReplyDto[];

  @ApiProperty()
  readonly number: number;
}

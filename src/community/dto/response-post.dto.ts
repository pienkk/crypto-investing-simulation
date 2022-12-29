import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Posts } from '../entity/post.entity';
import { ResponseReplyDto } from './response-reply.dto';
export class ResponsePostsDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 Id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '게시글 제목' })
  private title: string;

  @IsString()
  @ApiProperty({ description: '게시글 내용' })
  private description: string;

  @IsDate()
  @ApiProperty({ description: '게시글 생성 날짜' })
  private created_at: Date;

  @ApiProperty()
  private user: ResponseUserDto;

  static fromEntity(entity: Posts): ResponsePostsDto {
    const dto = new ResponsePostsDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.created_at = entity.created_at;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;

    return dto;
  }

  static fromEntities(entities: Posts[]): ResponsePostsDto[] {
    return entities.map((entity) => ResponsePostsDto.fromEntity(entity));
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

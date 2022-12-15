import { IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Posts } from '../entity/post.entity';
import { ReplyListDto, ResponseReplyDto } from './response-reply.dto';
export class ResponsePostsDto {
  @IsNumber()
  private id: number;

  @IsString()
  private title: string;

  @IsString()
  private description: string;

  @IsDate()
  private created_at: Date;

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
  readonly post: ResponsePostsDto[];

  @IsNumber()
  readonly number: number;
}

export class PostDetailDto {
  readonly post: ResponsePostsDto;

  readonly reply: ResponseReplyDto[];

  readonly number: number;
}

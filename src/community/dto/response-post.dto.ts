import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Likes } from '../entity/like.entity';
import { Posts } from '../entity/post.entity';
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

  @IsNumber()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @IsBoolean()
  @ApiProperty({ description: '게시글 공개 여부' })
  isPublished: boolean;

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
    dto.isPublished = entity.isPublished;
    dto.created_at = entity.created_at;
    dto.hits = entity.hits;
    dto.categoryId = entity.categoryId;

    if (entity.replies) {
      dto.repliesCount = entity.replies.length;
    }
    if (entity.user) {
      const user = ResponseUserDto.fromEntity(entity.user);
      dto.user = user;
    }
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
  @ApiProperty({ description: '총 게시글 수' })
  readonly number: number;
}

export class ResponsePostDetailDto {
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

  @IsNumber()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @IsDate()
  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @IsNumber()
  @ApiProperty({ description: '댓글 수' })
  repliesCount: number;

  @IsBoolean()
  @ApiProperty({
    description: '내가 선택한 좋아요 타입 ex) true = 좋아요, false = 싫어요',
  })
  isLike: boolean;

  @IsNumber()
  @ApiProperty({ description: '좋아요 수' })
  likeCount: number;

  @IsBoolean()
  @ApiProperty({ description: '게시글 공개 여부' })
  isPublished: boolean;

  @IsNumber()
  @ApiProperty({ description: '싫어요 수' })
  unLikeCount: number;

  @IsNumber()
  @ApiProperty({ description: '이전 게시글 id' })
  prevPostId: number;

  @IsNumber()
  @ApiProperty({ description: '다음 게시글 id' })
  nextPostId: number;

  @ApiProperty()
  user: ResponseUserDto;

  static fromEntity(
    entity: Posts,
    like: Likes,
    likeCount: number,
    unlikeCount: number,
    prevPostId: number,
    nextPostId: number,
  ): ResponsePostDetailDto {
    const dto = new ResponsePostDetailDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.created_at = entity.created_at;
    dto.hits = entity.hits;
    dto.categoryId = entity.categoryId;
    dto.repliesCount = entity.replies.length;
    dto.isPublished = entity.isPublished;
    dto.likeCount = likeCount;
    dto.unLikeCount = unlikeCount;
    dto.prevPostId = prevPostId;
    dto.nextPostId = nextPostId;

    dto.isLike = null;

    const user = ResponseUserDto.fromEntity(entity.user);
    dto.user = user;
    if (like) dto.isLike = like.isLike;

    return dto;
  }

  static hitsPlus(entity: ResponsePostDetailDto) {
    entity.hits += 1;
    return entity;
  }
}

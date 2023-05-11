import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { LikeEntity } from '../entity/like.entity';
import { PostEntity } from '../entity/post.entity';

// 게시글 응답 DTO
export class ResponsePostDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 Id', example: 5 })
  id: number;

  @IsString()
  @ApiProperty({ description: '게시글 제목', example: '게시글 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '게시글 내용', example: '게시글 내용' })
  description: string;

  @IsNumber()
  @ApiProperty({ description: '게시글 조회수', example: 200 })
  hits: number;

  @IsNumber()
  @ApiProperty({ description: '카테고리 id', example: 1 })
  categoryId: number;

  @IsBoolean()
  @ApiProperty({ description: '게시글 공개 여부', example: true })
  isPublished: boolean;

  @IsDate()
  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @IsNumber()
  @ApiProperty({ description: '댓글 수', example: 10 })
  repliesCount: number;

  @ApiProperty({ type: ResponseUserDto })
  user: ResponseUserDto;

  static fromEntity(entity: PostEntity): ResponsePostDto {
    const dto = new ResponsePostDto();
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

  static fromEntities(entities: PostEntity[]): ResponsePostDto[] {
    return entities.map((entity) => ResponsePostDto.fromEntity(entity));
  }
}

// 게시글 페이지네이션 응답 DTO
export class ResponsePostPageNationDto {
  @ApiProperty({ type: [ResponsePostDto] })
  readonly post: ResponsePostDto[];

  @IsNumber()
  @ApiProperty({ description: '총 게시글 수', example: 10 })
  readonly number: number;
}

// 게시글 상세 응답 DTO
export class ResponsePostDetailDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 Id', example: 6 })
  id: number;

  @IsString()
  @ApiProperty({ description: '게시글 제목', example: '게시글 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '게시글 내용', example: '게시글 내용' })
  description: string;

  @IsNumber()
  @ApiProperty({ description: '게시글 조회수', example: 50 })
  hits: number;

  @IsNumber()
  @ApiProperty({ description: '카테고리 id', example: 1 })
  categoryId: number;

  @IsDate()
  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @IsNumber()
  @ApiProperty({ description: '댓글 수', example: 20 })
  repliesCount: number;

  @IsBoolean()
  @ApiProperty({
    description: '내가 선택한 좋아요 타입 ex) true = 좋아요, false = 싫어요',
    example: true,
  })
  isLike: boolean;

  @IsNumber()
  @ApiProperty({ description: '좋아요 수', example: 20 })
  likeCount: number;

  @IsBoolean()
  @ApiProperty({ description: '게시글 공개 여부', example: true })
  isPublished: boolean;

  @IsNumber()
  @ApiProperty({ description: '싫어요 수', example: 10 })
  unLikeCount: number;

  @IsNumber()
  @ApiProperty({ description: '이전 게시글 id', example: 5 })
  prevPostId: number;

  @IsNumber()
  @ApiProperty({ description: '다음 게시글 id', example: 7 })
  nextPostId: number;

  @ApiProperty({ description: '게시글 작성자' })
  user: ResponseUserDto;

  static fromEntity(
    entity: PostEntity,
    like: LikeEntity,
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

// 게시글 생성 응답 DTO
export class ResponseCreatePostDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 id', example: 6 })
  postId: number;
}

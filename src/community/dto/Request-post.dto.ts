import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// 게시글 생성 요청 DTO
export class RequestCreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목', required: true, example: '게시글 제목' })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용', required: true, example: '게시글 내용' })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '카테고리 id', required: true, example: 1 })
  readonly categoryId: number;
}

// 게시글 수정 요청 DTO
export class RequestUpdatePostDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '제목',
    required: true,
    example: '수정할 게시글 제목',
  })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '내용',
    required: true,
    example: '수정할 게시글 내용',
  })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '카테고리 id', required: true, example: 1 })
  readonly categoryId: number;
}

/**
 * 게시글 삭제 요청 DTO
 */
export class RequestDeletePostDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @ApiProperty({
    description: '삭제할 게시글 id 리스트',
    required: true,
    example: [1, 2],
  })
  readonly postId: number[];
}

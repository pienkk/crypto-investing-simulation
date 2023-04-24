import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목', required: true })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용', required: true })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '카테고리 id', required: true })
  readonly categoryId: number;
}

export class RequestDeletePostDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '삭제할 게시글 id 리스트',
    required: true,
    example: [1, 2],
  })
  readonly postId: number[];
}

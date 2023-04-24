import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
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

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '페이지', default: 1, required: false })
  readonly page?: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '페이지 당 보여지는 수',
    default: 10,
    required: false,
  })
  readonly number?: number = 10;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '게시글 카테고리', required: true })
  readonly categoryId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '검색어', required: false })
  readonly content?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '작성자', required: false })
  readonly nickname?: string = '';
}

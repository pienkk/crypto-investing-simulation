import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// 검색 페이지네이션 DTO
export class PageNationDto {
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
}

// 게시글 검색 요청 DTO
export class RequestGetPostsQueryDto extends PageNationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '게시글 카테고리', required: true, example: 1 })
  readonly categoryId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '검색어', required: false })
  readonly search?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '검색 필터 종류', required: false })
  readonly filter?: string = '';
}

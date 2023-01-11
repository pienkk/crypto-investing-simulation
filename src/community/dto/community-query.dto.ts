import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '페이지', default: 1, required: false })
  readonly page: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '페이지 당 보여지는 수',
    default: 10,
    required: false,
  })
  readonly number: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '작성글 검색어', required: false })
  readonly title?: string = '';
}

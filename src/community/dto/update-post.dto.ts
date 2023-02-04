import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '제목', required: true })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '내용', required: true })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '카테고리 id', required: true })
  readonly categoryId: number;
}

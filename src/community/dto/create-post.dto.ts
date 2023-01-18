import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목', required: true })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용', required: true })
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '게시글 라벨', required: true })
  readonly label: string;
}

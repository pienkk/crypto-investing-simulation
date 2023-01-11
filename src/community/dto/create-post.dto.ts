import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ description: '제목', required: true })
  readonly title: string;

  @IsString()
  @ApiProperty({ description: '내용', required: true })
  readonly description: string;

  @IsNumber() // user 기능 생성후 삭제
  @ApiProperty({ description: '유저아이디' })
  readonly userId: number;
}

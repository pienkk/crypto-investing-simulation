import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목', required: true })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용', required: true })
  readonly description: string;

  @IsNumber() // user 기능 생성후 삭제
  @ApiProperty({ description: '유저아이디' })
  readonly userId: number;
}

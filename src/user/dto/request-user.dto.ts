import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestSignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'kisuk623@gmail.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름', required: true, example: '홍길동' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로필 이미지',
    required: true,
    example:
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  })
  readonly profileImage: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '닉네임', required: false, example: '장기석' })
  readonly nickname: string;
}

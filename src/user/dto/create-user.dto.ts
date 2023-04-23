import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이메일', required: true })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름', required: true })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '프로필 이미지', required: true })
  readonly profileImage: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '닉네임', required: false })
  readonly nickname: string;
}

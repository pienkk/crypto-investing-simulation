import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../entity/user.entity';

/**
 * 유저 정보 응답 DTO
 */
export class ResponseUserDto {
  @IsNumber()
  @ApiProperty({ description: '유저 id', example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ description: '유저 닉네임', example: '기석' })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: '유저 소개',
    example: '백엔드 개발자 장기석입니다.',
  })
  description: string;

  static fromEntity(entity: User): ResponseUserDto {
    const dto = new ResponseUserDto();
    dto.id = entity.id;
    dto.nickname = entity.nickname;
    dto.description = entity.description;
    return dto;
  }
}

/**
 * 로그인 응답 DTO
 */
export class ResponseSignInDto {
  @IsString()
  @ApiProperty({ description: 'JWT 토큰' })
  accessToken: string;

  @IsString()
  @ApiProperty({ description: '유저 닉네임', example: '기석' })
  nickname: string;

  @IsNumber()
  @ApiProperty({ description: '유저 id', example: 1 })
  id: number;
}

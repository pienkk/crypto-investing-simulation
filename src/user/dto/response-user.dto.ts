import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../entity/user.entity';

export class ResponseUserDto {
  @IsNumber()
  @ApiProperty({ description: '유저 id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '유저 닉네임' })
  private nickname: string;

  @IsString()
  @ApiProperty({ description: '유저 소개' })
  private description: string;

  static fromEntity(entity: User): ResponseUserDto {
    const dto = new ResponseUserDto();
    dto.id = entity.id;
    dto.nickname = entity.nickname;
    dto.description = entity.description;
    return dto;
  }
}

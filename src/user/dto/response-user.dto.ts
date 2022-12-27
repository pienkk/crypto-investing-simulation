import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../entity/user.entity';

export class ResponseUserDto {
  @IsNumber()
  @ApiProperty()
  private id: number;

  @IsString()
  @ApiProperty()
  private nickname: string;

  @IsString()
  @ApiProperty()
  private description: string;

  static fromEntity(entity: User): ResponseUserDto {
    const dto = new ResponseUserDto();
    dto.id = entity.id;
    dto.nickname = entity.nickname;
    dto.description = entity.description;
    return dto;
  }
}

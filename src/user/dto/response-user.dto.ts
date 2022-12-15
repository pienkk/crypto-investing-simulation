import { IsNumber, IsString } from 'class-validator';
import { User } from '../entity/user.entity';

export class ResponseUserDto {
  @IsNumber()
  private id: number;

  @IsString()
  private nickname: string;

  @IsString()
  private description: string;

  static fromEntity(entity: User): ResponseUserDto {
    const dto = new ResponseUserDto();
    dto.id = entity.id;
    dto.nickname = entity.nickname;
    dto.description = entity.description;
    return dto;
  }
}

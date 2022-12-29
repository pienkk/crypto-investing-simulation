import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseUserInfoDto {
  @IsString()
  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;

  @IsNumber()
  @ApiProperty({ description: '유저 소지금' })
  money: number;

  @IsNumber()
  @ApiProperty({ description: '순 이익금 총액' })
  totalYeildMoney: number;

  @IsNumber()
  @ApiProperty({ description: '순 이익금 퍼센트' })
  totalYeildPercent: number;

  static fromEntity(entity: RawUserQuery): ResponseUserInfoDto {
    const dto = new ResponseUserInfoDto();
    dto.nickname = entity.u_nickname;
    dto.money = Number(entity.u_money);
    dto.totalYeildMoney = Number(entity.totalYeildMoney);
    dto.totalYeildPercent = Number(entity.totalYeildPercent);
    return dto;
  }
}

export interface RawUserQuery {
  u_nickname: string;
  u_money: string;
  totalYeildPercent: string;
  totalYeildMoney: string;
}

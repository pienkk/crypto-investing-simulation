import { IsNumber, IsString } from 'class-validator';

export class ResponseUserInfoDto {
  @IsString()
  nickname: string;

  @IsNumber()
  money: number;

  @IsNumber()
  totalYeildMoney: number;

  @IsNumber()
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

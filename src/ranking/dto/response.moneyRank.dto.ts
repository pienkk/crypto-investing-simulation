import { IsNumber, IsString } from 'class-validator';

export class ResponseMoneyRankDto {
  @IsNumber()
  private id: number;

  @IsString()
  private nickname: string;

  @IsNumber()
  private totalMoney: number;

  @IsNumber()
  private yieldPercent: number;

  static fromEntity(entity: MoneyRank): ResponseMoneyRankDto {
    const dto = new ResponseMoneyRankDto();
    dto.id = entity.ID;
    dto.nickname = entity.nickName;
    dto.totalMoney = Number(entity.totalMoney);
    dto.yieldPercent = Number(entity.yieldPercent);

    return dto;
  }

  static fromEntities(entities: MoneyRank[]): ResponseMoneyRankDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

interface MoneyRank {
  ID: number;
  nickName: string;
  totalMoney: string;
  yieldPercent: string;
}

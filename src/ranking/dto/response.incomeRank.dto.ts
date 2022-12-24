import { IsNumber, IsString } from 'class-validator';

export class ResponseIncomeRankDto {
  @IsNumber()
  private id: number;

  @IsString()
  private nickname: string;

  @IsNumber()
  private incomeMoney: number;

  @IsNumber()
  private incomePercent: number;

  static fromEntity(entity: RawQueryEntity): ResponseIncomeRankDto {
    const dto = new ResponseIncomeRankDto();
    dto.id = entity.ID;
    dto.nickname = entity.nickName;
    dto.incomeMoney = Number(entity.incomeMoney);
    dto.incomePercent = Number(entity.incomePercent);
    return dto;
  }

  static fromEntities(entities: RawQueryEntity[]): ResponseIncomeRankDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

interface RawQueryEntity {
  ID: number;
  nickName: string;
  incomeMoney: string;
  incomePercent: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseIncomeRankDto {
  @IsNumber()
  @ApiProperty({ description: '유저 id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '유저 닉네임' })
  private nickname: string;

  @IsNumber()
  @ApiProperty({ description: '실현 수익 금액' })
  private incomeMoney: number;

  @IsNumber()
  @ApiProperty({ description: '실현 수익 률' })
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

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseMoneyRankDto {
  @IsNumber()
  @ApiProperty({ description: '유저 id', example: 1 })
  private id: number;

  @IsString()
  @ApiProperty({ description: '유저 닉네임', example: '기석' })
  private nickname: string;

  @IsNumber()
  @ApiProperty({ description: '소지금 + 코인 가액의 합', example: 100000 })
  private totalMoney: number;

  @IsNumber()
  @ApiProperty({ description: '순 수익률', example: 10 })
  private yieldPercent: number;

  @IsNumber()
  @ApiProperty({ description: '랭킹', example: 1 })
  private ranking: number;

  static fromEntity(entity: MoneyRank): ResponseMoneyRankDto {
    const dto = new ResponseMoneyRankDto();
    dto.id = entity.id;
    dto.nickname = entity.nickname;
    dto.totalMoney = Number(entity.totalMoney);
    dto.yieldPercent = Number(entity.yieldPercent);
    dto.ranking = Number(entity.ranking);

    return dto;
  }

  static fromEntities(entities: MoneyRank[]): ResponseMoneyRankDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

interface MoneyRank {
  id: number;
  nickname: string;
  totalMoney: string;
  yieldPercent: string;
  ranking: string;
}

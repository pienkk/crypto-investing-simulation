import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Trade } from '../entity/trade.entity';
import { PurchaseStatus, TradeStatus } from '../enum/trade.status.enum';

export class ResponseTradeDto {
  @IsNumber()
  @ApiProperty({ description: '거래 id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '코인 이름' })
  private name: string;

  @IsString()
  @ApiProperty({ description: '코인 티커' })
  private ticker: string;

  @IsString()
  @ApiProperty({ description: '코인 심볼' })
  private symbol: string;

  @IsEnum(PurchaseStatus)
  @ApiProperty({ description: '구매 / 판매 상태' })
  private isPurchase: PurchaseStatus;

  @IsEnum(TradeStatus)
  @ApiProperty({ description: '거래 상태 정보' })
  private status: TradeStatus;

  @IsNumber()
  @ApiProperty({ description: '구매 가격' })
  private buyPrice: number;

  @IsNumber()
  @ApiProperty({ description: '판매 가격' })
  private sellPrice: number;

  @IsNumber()
  @ApiProperty({ description: '수량' })
  private quantity: number;

  @IsNumber()
  @ApiProperty({ description: '수수료' })
  private fee: number;

  @IsNumber()
  @ApiProperty({ description: '수익 금액' })
  private gainMoney: number;

  @IsNumber()
  @ApiProperty({ description: '수익 퍼센트' })
  private gainPercent: number;

  @IsDate()
  @ApiProperty({ description: '생성 시간' })
  private created_at: Date;

  static fromEntity(entity: Trade): ResponseTradeDto {
    const dto = new ResponseTradeDto();
    dto.id = entity.id;
    dto.name = entity.coin.name;
    dto.ticker = entity.coin.ticker;
    dto.symbol = entity.coin.symbol;
    dto.isPurchase = entity.isPurchase;
    dto.status = entity.status;
    dto.buyPrice = entity.buyPrice;
    dto.sellPrice = entity.sellPrice;
    dto.quantity = entity.quantity;
    dto.fee = entity.fee;
    dto.gainMoney = entity.gainMoney;
    dto.gainPercent = entity.gainPercent;
    dto.created_at = entity.created_at;

    return dto;
  }

  static fromEntities(entities: Trade[]): ResponseTradeDto[] {
    return entities.map((entity) => ResponseTradeDto.fromEntity(entity));
  }
}

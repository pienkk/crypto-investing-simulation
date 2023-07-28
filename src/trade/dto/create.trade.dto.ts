import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { TradeEntity } from '../entity/trade.entity';

export class CreateTradeDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({
    description: '코인 구매/판매 여부 0 = 구매 , 1 = 판매',
    required: true,
  })
  private readonly isPurchase: number;

  @IsNumber()
  @ApiProperty({ description: '거래 가격', required: true })
  private readonly price: number;

  @IsNumber()
  @ApiProperty({ description: '거래 수량', required: true })
  private readonly quantity: number;

  @IsNumber()
  @ApiProperty({ description: '코인 id', required: true })
  private readonly coinId: number;

  static toEntity(dto: CreateTradeDto, userId: number): TradeEntity {
    const entity = new TradeEntity();
    entity.userId = userId;
    entity.coinId = dto.coinId;
    entity.isPurchase = dto.isPurchase;
    entity.status = 0;
    entity.quantity = dto.quantity;
    if (dto.isPurchase === 0) entity.buyPrice = dto.price;
    if (dto.isPurchase === 1) entity.sellPrice = dto.price;
    entity.fee = dto.price * dto.quantity * 0.005;
    return entity;
  }
}

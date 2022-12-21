import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Trade } from '../entity/trade.entity';

export class CreateTradeDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  private readonly isPurchase: number;

  @IsNumber()
  private readonly price: number;

  @IsNumber()
  private readonly quantity: number;

  @IsNumber()
  private readonly userId: number;

  @IsNumber()
  private readonly coinId: number;

  static toEntity(dto: CreateTradeDto): Trade {
    const entity = new Trade();
    entity.userId = dto.userId;
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

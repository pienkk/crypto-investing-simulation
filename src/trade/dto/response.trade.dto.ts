import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Trade } from '../entity/trade.entity';
import { PurchaseStatus, TradeStatus } from '../enum/trade.status.enum';

export class ResponseTradeDto {
  @IsNumber()
  private id: number;

  @IsString()
  private name: string;

  @IsString()
  private ticker: string;

  @IsString()
  private symbol: string;

  @IsEnum(PurchaseStatus)
  private isPurchase: PurchaseStatus;

  @IsEnum(TradeStatus)
  private status: TradeStatus;

  @IsNumber()
  private buyPrice: number;

  @IsNumber()
  private sellPrice: number;

  @IsNumber()
  private quantity: number;

  @IsNumber()
  private fee: number;

  @IsNumber()
  private gainMoney: number;

  @IsNumber()
  private gainPercent: number;

  @IsDate()
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

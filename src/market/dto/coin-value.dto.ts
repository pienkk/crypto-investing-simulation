import { IsNumber } from 'class-validator';
import { Coin } from '../entity/coin.entity';
import { CoinHistory } from '../entity/coinsHistory.entity';

export class CoinValueDto {
  @IsNumber()
  public id: number;

  @IsNumber()
  private coinId: number;

  @IsNumber()
  private price: number;

  @IsNumber()
  private oneHourPrice: number;

  @IsNumber()
  private fourHourPrice: number;

  @IsNumber()
  private oneDayPrice: number;

  @IsNumber()
  private oneDayVolum: number;

  @IsNumber()
  private quantity: number;

  static fromEntity<T>(entity: Array<T>, id: number): CoinValueDto {
    const dto = new CoinValueDto();
    dto.id = id;
    dto.price = Number(entity[23][4]);
    dto.oneHourPrice = Number(entity[22][4]);
    dto.fourHourPrice = Number(entity[20][4]);
    dto.oneDayPrice = Number(entity[0][4]);
    dto.oneDayVolum = Number(
      entity.reduce((a, b) => Number(a) + Number(b[5]), 0),
    );
    return dto;
  }

  static fromEntities<T>(entities: Array<T[]>, coin: Coin[]): CoinValueDto[] {
    return entities.map((entity, idx) =>
      CoinValueDto.fromEntity(entity, coin[idx].id),
    );
  }

  static toEntity(dto: CoinValueDto): CoinHistory {
    const entity = new CoinHistory();
    entity.id = dto.id;
    entity.price = dto.price;
    entity.oneHourPrice = dto.oneHourPrice;
    entity.fourHourPrice = dto.fourHourPrice;
    entity.oneDayPrice = dto.oneDayPrice;
    entity.oneDayVolum = dto.oneDayVolum;
    console.log(entity);
    return entity;
  }

  static toEntities(dtos: CoinValueDto[]): CoinHistory[] {
    return dtos.map((dto) => CoinValueDto.toEntity(dto));
  }
}

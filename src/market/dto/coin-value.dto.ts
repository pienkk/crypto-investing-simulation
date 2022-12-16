import { IsNumber, IsString } from 'class-validator';
import { Coin } from '../entity/coin.entity';

export class CoinValueDto {
  @IsNumber()
  public id: number;

  @IsString()
  public symbol: string;

  @IsNumber()
  private price: number;

  @IsNumber()
  private oneHourPrice: number;

  @IsNumber()
  private fourHourPrice: number;

  @IsNumber()
  private oneDayPrice: number;

  @IsNumber()
  private oneDayVolume: number;

  @IsNumber()
  private quantity: number;

  static fromEntity<T>(entity: Array<T>, symbol: string): CoinValueDto {
    const dto = new CoinValueDto();
    dto.symbol = symbol;
    dto.oneHourPrice = Number(entity[22][4]);
    dto.fourHourPrice = Number(entity[20][4]);
    dto.oneDayPrice = Number(entity[0][4]);
    dto.oneDayVolume = Number(
      entity.reduce((a, b) => Number(a) + Number(b[5]), 0),
    );
    return dto;
  }

  static fromEntities<T>(entities: Array<T[]>, coin: Coin[]): CoinValueDto[] {
    return entities.map((entity, idx) =>
      CoinValueDto.fromEntity(entity, coin[idx].symbol),
    );
  }

  static toEntity(dto: CoinValueDto): Coin {
    const entity = new Coin();
    entity.symbol = dto.symbol;
    entity.oneHourPrice = dto.oneHourPrice;
    entity.fourHourPrice = dto.fourHourPrice;
    entity.oneDayPrice = dto.oneDayPrice;
    entity.oneDayVolume = dto.oneDayVolume;
    return entity;
  }

  static toEntities(dtos: CoinValueDto[]): Coin[] {
    return dtos.map((dto) => CoinValueDto.toEntity(dto));
  }
}

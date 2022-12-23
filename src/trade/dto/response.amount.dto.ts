import { IsNumber, IsString } from 'class-validator';
import { Coin } from 'src/market/entity/coin.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';

export class ResponseAmountDto {
  @IsNumber()
  private id: number;

  @IsString()
  private name: string;

  @IsNumber()
  private quantity: number;

  @IsNumber()
  private money: number;

  static fromDto(entity: Coin): ResponseAmountDto {
    const dto = new ResponseAmountDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.quantity = entity.wallet[0].quantity;
    dto.money = entity.wallet[0].user.money;
    return dto;
  }
}

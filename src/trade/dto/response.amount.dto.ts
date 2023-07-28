import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoinEntity } from 'src/market/entity/coin.entity';

export class ResponseAmountDto {
  @IsNumber()
  @ApiProperty({ description: '코인 id' })
  private id: number;

  @IsString()
  @ApiProperty({ description: '코인 이름' })
  private name: string;

  @IsNumber()
  @ApiProperty({ description: '소지 갯수' })
  private quantity: number;

  @IsNumber()
  @ApiProperty({ description: '소지 금액' })
  private money: number;

  static fromDto(entity: CoinEntity): ResponseAmountDto {
    const dto = new ResponseAmountDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.quantity = entity.wallet[0].quantity;
    dto.money = entity.wallet[0].user.money;
    return dto;
  }
}

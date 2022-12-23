import { IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

import { RawUserQuery, ResponseUserInfoDto } from './response.userInfo.dto';

export class ResponseWalletDto {
  @IsNumber()
  private coinId: number;

  @IsString()
  private name: string;

  @IsString()
  private ticker: string;

  @IsString()
  private image: string;

  @IsNumber()
  private price: number;

  @IsNumber()
  private purchasePrice: number;

  @IsNumber()
  private quantity: number;

  @IsNumber()
  private yieldPercent: number;

  @IsNumber()
  private yieldMoney: number;

  static fromEntity(entity: RawWalletQuery): ResponseWalletDto {
    const dto = new ResponseWalletDto();
    dto.coinId = entity.w_coinId;
    dto.purchasePrice = Number(entity.w_purchasePrice);
    dto.quantity = Number(entity.w_quantity);
    dto.name = entity.coin_name;
    dto.ticker = entity.coin_ticker;
    dto.image = entity.coin_image;
    dto.price = Number(entity.coin_price);
    dto.yieldMoney = Number(entity.yieldMoney);
    dto.yieldPercent = Number(entity.yieldPercent);

    return dto;
  }
  static fromEntities(entities: RawWalletQuery[]): ResponseWalletDto[] {
    return entities.map((el) => this.fromEntity(el));
  }
}

export class ResponseWallet {
  private wallets: ResponseWalletDto[];

  private user: ResponseUserInfoDto;

  static toResponse(
    wallet: RawWalletQuery[],
    userInfo: RawUserQuery,
  ): ResponseWallet {
    const response = new ResponseWallet();
    const wallets = ResponseWalletDto.fromEntities(wallet);
    const user = ResponseUserInfoDto.fromEntity(userInfo);
    response.wallets = wallets;
    response.user = user;

    return response;
  }
}

interface RawWalletQuery {
  w_coinId: number;
  w_purchasePrice: string;
  w_quantity: string;
  coin_name: string;
  coin_ticker: string;
  coin_image: string;
  coin_price: string;
  yieldPercent: string;
  yieldMoney: string;
}

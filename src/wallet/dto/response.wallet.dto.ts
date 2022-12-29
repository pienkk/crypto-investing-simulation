import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

import { RawUserQuery, ResponseUserInfoDto } from './response.userInfo.dto';

export class ResponseWalletDto {
  @IsNumber()
  @ApiProperty({ description: '코인 id' })
  private coinId: number;

  @IsString()
  @ApiProperty({ description: '코인 이름' })
  private name: string;

  @IsString()
  @ApiProperty({ description: '코인 티커' })
  private ticker: string;

  @IsString()
  @ApiProperty({ description: '코인 이미지' })
  private image: string;

  @IsNumber()
  @ApiProperty({ description: '코인 현재 가격' })
  private price: number;

  @IsNumber()
  @ApiProperty({ description: '코인 구매 가격' })
  private purchasePrice: number;

  @IsNumber()
  @ApiProperty({ description: '코인 소지 갯수' })
  private quantity: number;

  @IsNumber()
  @ApiProperty({ description: '순 이익률' })
  private yieldPercent: number;

  @IsNumber()
  @ApiProperty({ description: '순 이익금' })
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
  @ApiProperty({ type: [ResponseWalletDto] })
  private wallets: ResponseWalletDto[];

  @ApiProperty({ type: ResponseUserInfoDto })
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

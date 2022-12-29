import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseWallet } from './dto/response.wallet.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({
    summary: '유저 지갑 정보 조회 API',
    description: '유저 소지금, 코인 갯수, 순 이익 조회',
  })
  @ApiOkResponse({ type: ResponseWallet })
  getWallet(@Query('userId') userId: number): Promise<ResponseWallet> {
    return this.walletService.getWallet(userId);
  }
}

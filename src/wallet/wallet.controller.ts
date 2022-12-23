import { Controller, Get, Query } from '@nestjs/common';
import { ResponseWallet } from './dto/response.wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get()
  getWallet(@Query('userId') userId: number): Promise<ResponseWallet> {
    return this.walletService.getWallet(userId);
  }
}

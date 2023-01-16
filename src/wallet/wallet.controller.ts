import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
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
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ResponseWallet })
  getWallet(@CurrentUser() user: JwtPayload): Promise<ResponseWallet> {
    return this.walletService.getWallet(user.id);
  }
}

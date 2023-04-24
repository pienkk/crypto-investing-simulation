import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { ResponseWallet } from './dto/response.wallet.dto';
import { WalletService } from './wallet.service';
import { Try, createResponseForm } from 'src/types';
import { responseObjectSchema } from 'src/types/swagger';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({
    summary: '유저 지갑 정보 조회 API',
    description: '유저 소지금, 코인 갯수, 순 이익 조회',
  })
  @ApiResponse({ status: 200, schema: responseObjectSchema(ResponseWallet) })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getWallet(
    @CurrentUser() user: JwtPayload,
  ): Promise<Try<ResponseWallet>> {
    const wallet = await this.walletService.getWallet(user.id);

    return createResponseForm(wallet);
  }
}

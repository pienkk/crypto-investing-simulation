import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/entity/user.repository';
import { ResponseWallet } from './dto/response.wallet.dto';
import { WalletRepository } from './entity/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async getWallet(userId: number): Promise<ResponseWallet> {
    const wallets = await this.walletRepository.getWallet(userId);
    const user = await this.userRepository.getWallet(userId);
    return ResponseWallet.toResponse(wallets, user);
  }
}

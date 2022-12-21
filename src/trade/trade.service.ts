import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/entity/user.repository';
import { WalletRepository } from 'src/wallet/wallet.repository';
import { CreateTradeDto } from './dto/create.trade.dto';
import { ResponseTradeDto } from './dto/response.trade.dto';
import { TradeRepository } from './entity/trade.repository';

@Injectable()
export class TradeService {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly walletRepository: WalletRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getTradeAll(userId: number) {
    const tradeEntity = await this.tradeRepository.getTradeAll(userId);
    return ResponseTradeDto.fromEntities(tradeEntity);
  }

  createTrade(createTradeDto: CreateTradeDto) {
    const tradeEntity = CreateTradeDto.toEntity(createTradeDto);
    return this.tradeRepository.createTrade(tradeEntity);
  }

  async cancelTrade(tradeId: number) {
    const tradeHistory = await this.tradeRepository.getTradeByProcess(tradeId);
    console.log(tradeHistory);
    if (!tradeHistory)
      throw new HttpException(
        'You can only cancel the trade by processing',
        HttpStatus.FORBIDDEN,
      );

    const result = await this.tradeRepository.removeTrade(tradeId);
    if (result.affected !== 1)
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);

    return;
  }

  async coin() {
    const tradeHistories = await this.tradeRepository.coinConclusion();

    tradeHistories.forEach(async (el) => {
      if (el.buyPrice >= el.coin.price) {
        const user = await this.userRepository.getOne(el.userId);

        const coinTotalAmount = el.coin.price * el.quantity + Number(el.fee);

        if (user.money > coinTotalAmount) {
          await this.tradeRepository.buyCoin(el.id, el.coin.price);
          await this.userRepository.updateMoney(-coinTotalAmount, user.id);

          const wallet = await this.walletRepository.getCoin(
            el.userId,
            el.coinId,
          );
          if (!wallet) await this.walletRepository.insertCoin(el);
          if (wallet) await this.walletRepository.updateCoin(el, wallet);
        }
      }
      if (el.sellPrice && el.coin.price >= el.sellPrice) {
        const coinTotalAmount = el.coin.price * el.quantity - el.fee;
        const wallet = await this.walletRepository.getCoin(
          el.userId,
          el.coinId,
        );
        await this.tradeRepository.sellCoin(el, wallet);
        await this.userRepository.updateMoney(coinTotalAmount, el.userId);
        await this.walletRepository.updateCoin(el, wallet);
      }
    });
  }
}

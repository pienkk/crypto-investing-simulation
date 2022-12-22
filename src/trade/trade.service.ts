import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { UserRepository } from 'src/user/entity/user.repository';
import { WalletRepository } from 'src/wallet/wallet.repository';
import { CreateTradeDto } from './dto/create.trade.dto';
import { ResponseAmountDto } from './dto/response.amount.dto';
import { ResponseTradeDto } from './dto/response.trade.dto';
import { TradeRepository } from './entity/trade.repository';

@Injectable()
export class TradeService {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly walletRepository: WalletRepository,
    private readonly userRepository: UserRepository,
    private readonly coinRepository: CoinRepository,
  ) {
    // setInterval(() => this.tradeSystem(), 1000);
  }

  async getTradeAll(userId: number) {
    const tradeEntity = await this.tradeRepository.getTradeAll(userId);
    return ResponseTradeDto.fromEntities(tradeEntity);
  }

  async getAmount(userId: number, symbol: string) {
    const amount = await this.coinRepository.getAmountByTrade(userId, symbol);
    return ResponseAmountDto.fromDto(amount);
  }

  createTrade(createTradeDto: CreateTradeDto) {
    const tradeEntity = CreateTradeDto.toEntity(createTradeDto);
    return this.tradeRepository.createTrade(tradeEntity);
  }

  async cancelTrade(tradeId: number) {
    const tradeHistory = await this.tradeRepository.getTradeByProcess(tradeId);
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

  async tradeSystem() {
    const tradeHistories = await this.tradeRepository.coinConclusion();

    tradeHistories.forEach(async (el) => {
      if (el.buyPrice >= el.coin.price) {
        const user = await this.userRepository.getOne(el.userId);

        const coinTotalAmount = el.coin.price * el.quantity + el.fee;

        if (user.money >= coinTotalAmount) {
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

        if (wallet.quantity >= el.quantity) {
          await this.tradeRepository.sellCoin(el, wallet);
          await this.userRepository.updateMoney(coinTotalAmount, el.userId);
          await this.walletRepository.updateCoin(el, wallet);
        }
      }
    });
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { UserRepository } from 'src/user/entity/user.repository';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import { WalletRepository } from 'src/wallet/entity/wallet.repository';
import { CreateTradeDto } from './dto/create.trade.dto';
import { ResponseAmountDto } from './dto/response.amount.dto';
import { ResponseTradeDto } from './dto/response.trade.dto';
import { Trade } from './entity/trade.entity';
import { TradeRepository } from './entity/trade.repository';

@Injectable()
export class TradeService {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly walletRepository: WalletRepository,
    private readonly userRepository: UserRepository,
    private readonly coinRepository: CoinRepository,
  ) {}

  async getTradeAll(userId: number): Promise<ResponseTradeDto[]> {
    const tradeEntity = await this.tradeRepository.getTradeAll(userId);

    return ResponseTradeDto.fromEntities(tradeEntity);
  }

  async getAmount(userId: number, symbol: string): Promise<ResponseAmountDto> {
    const amount = await this.coinRepository.getAmountByTrade(userId, symbol);

    return ResponseAmountDto.fromDto(amount);
  }

  async createTrade(createTradeDto: CreateTradeDto): Promise<Trade> {
    const tradeEntity = CreateTradeDto.toEntity(createTradeDto);

    return await this.tradeRepository.save(tradeEntity);
  }

  async cancelTrade(tradeId: number): Promise<boolean> {
    const tradeHistory = await this.tradeRepository.findOneBy({
      id: tradeId,
      status: 0,
    });

    if (!tradeHistory) {
      throw new HttpException(
        'You can only cancel the trade by processing',
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.tradeRepository.update(tradeId, { status: 2 });
    if (result.affected !== 1)
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);

    return true;
  }
  insertCoin(tradeEntity: Trade) {
    const wallet = this.walletRepository.create({
      coinId: tradeEntity.coinId,
      userId: tradeEntity.userId,
      purchasePrice: tradeEntity.coin.price,
      quantity: tradeEntity.quantity,
    });
    this.walletRepository.save(wallet);
  }

  updateCoin(tradeEntity: Trade, wallet: Wallet) {
    if (tradeEntity.isPurchase === 0) {
      wallet.purchasePrice =
        (tradeEntity.coin.price * tradeEntity.quantity +
          wallet.purchasePrice * wallet.quantity) /
        (tradeEntity.quantity + wallet.quantity);
      wallet.quantity += tradeEntity.quantity;
    }
    if (tradeEntity.isPurchase === 1) wallet.quantity -= tradeEntity.quantity;

    this.walletRepository.update(wallet.id, {
      purchasePrice: wallet.purchasePrice,
      quantity: wallet.quantity,
    });
  }

  async tradeSystem(): Promise<void> {
    const tradeHistories = await this.tradeRepository.coinConclusion();

    tradeHistories.forEach(async (el) => {
      if (el.buyPrice >= el.coin.price) {
        const user = await this.userRepository.findOneBy({ id: el.userId });

        const coinTotalAmount = el.coin.price * el.quantity + el.fee;

        if (user.money >= coinTotalAmount) {
          await this.tradeRepository.buyCoin(el.id, el.coin.price);
          await this.userRepository.updateMoney(-coinTotalAmount, user.id);

          const wallet = await this.walletRepository.findOneBy({
            userId: el.userId,
            coinId: el.coinId,
          });

          if (!wallet) this.insertCoin(el);
          if (wallet) this.updateCoin(el, wallet);
        }
      }

      if (el.sellPrice && el.coin.price >= el.sellPrice) {
        const coinTotalAmount = el.coin.price * el.quantity - el.fee;
        const wallet = await this.walletRepository.findOneBy({
          userId: el.userId,
          coinId: el.coinId,
        });

        if (wallet.quantity >= el.quantity) {
          await this.tradeRepository.sellCoin(el, wallet);
          await this.userRepository.updateMoney(coinTotalAmount, el.userId);
          this.updateCoin(el, wallet);
        }
      }
    });
  }
}

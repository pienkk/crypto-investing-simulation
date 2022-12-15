import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CoinRepository } from './entity/coin.repository';
import { Coin } from './entity/coin.entity';
import { CoinValueDto } from './dto/coin-value.dto';
import { CoinHistoryRepository } from './entity/coinHistory.repository';

@Injectable()
export class MarketService {
  constructor(
    private coinRepository: CoinRepository,
    private http: HttpService,
    private coinHistoryRepository: CoinHistoryRepository,
  ) {}

  async getBinance(coin: Coin[]) {
    const date = new Date().getTime();
    return await Promise.all(
      coin.map(async (el: Coin) => {
        return (
          await this.http
            .get(
              `https://api.binance.com/api/v3/klines?symbol=${el.symbol}&interval=1h&limit=24&endTime=${date}`,
            )
            .toPromise()
        ).data;
      }),
    );
  }

  async updateCoinInfo() {
    setInterval(async () => {
      const coin = await this.coinRepository.getCoinList();
      const data = await this.getBinance(coin);
      const historyDtos = CoinValueDto.fromEntities(data, coin);
      const historyEntities = CoinValueDto.toEntities(historyDtos);
      await this.coinHistoryRepository.updateCoin(historyEntities);
    }, 60000);
  }
}

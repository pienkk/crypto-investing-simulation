import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { Coin } from 'src/market/entity/coin.entity';
import { CoinValueDto } from 'src/market/dto/coin-value.dto';

@Injectable()
export class BinanceService {
  async getBinance(coin: Coin[]) {
    const date = new Date().getTime();
    try {
      return await Promise.all(
        coin.map(async (el: Coin) => {
          return (
            await firstValueFrom(
              this.http.get(
                `https://api.binance.com/api/v3/klines?symbol=${el.symbol}&interval=1h&limit=24&endTime=${date}`,
              ),
            )
          ).data;
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  constructor(
    private coinRepository: CoinRepository,
    private http: HttpService,
  ) {
    setInterval(async () => {
      const coin = await this.coinRepository.getCoinList();
      const data = await this.getBinance(coin);
      const historyDtos = CoinValueDto.fromEntities(data, coin);
      const historyEntities = CoinValueDto.toEntities(historyDtos);
      await this.coinRepository.updateCoinByREST(historyEntities);
    }, 3000);
  }
}

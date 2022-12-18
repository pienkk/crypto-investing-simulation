import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { Coin } from 'src/market/entity/coin.entity';
import { CoinValueDto } from 'src/market/dto/coin-value.dto';
import { AxiosError } from 'axios';

@Injectable()
export class BinanceService {
  async getBinance(coin: Coin[]) {
    const date = new Date().getTime();
    // try {
    return await Promise.all(
      coin.map(async (el: Coin) => {
        return (
          await firstValueFrom(
            this.http
              .get(
                `https://api.binance.com/api/v3/klines?symbol=${el.symbol}&interval=1h&limit=24&endTime=${date}`,
              )
              .pipe(
                catchError((error: AxiosError) => {
                  console.log(error);
                  throw error;
                }),
              ),
          )
        ).data;
      }),
    );
    // } catch (error) {
    //   throw error;
    // }
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
    }, 120000);
  }
}

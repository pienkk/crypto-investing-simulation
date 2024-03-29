import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { CoinEntity } from 'src/market/entity/coin.entity';
import { CoinValueDto } from 'src/market/dto/coin-value.dto';
import { AxiosError } from 'axios';
import { CoinHistoryRepository } from 'src/market/entity/coinHistory.repository';
import axios from 'axios';

const ONEHOUR = 3600;
const FOURHOUR = 14400;

@Injectable()
export class BinanceService {
  // async getBinance(coin: CoinEntity[]) {
  //   const date = new Date().getTime();
  // try {
  // return await Promise.all(
  //   coin.map(async (el: CoinEntity) => {
  //     return (
  //       await firstValueFrom(
  //         this.http
  //           .get(
  //             `https://api.binance.com/api/v3/klines?symbol=${el.symbol}&interval=1h&limit=24&endTime=${date}`,
  //           )
  //           .pipe(
  //             catchError((error: AxiosError) => {
  //               console.log(error);
  //               throw error;
  //             }),
  //           ),
  //       )
  //     ).data;
  //   }),
  // );
  // } catch (error) {
  //   throw error;
  // }
  // }

  constructor(
    private readonly coinRepository: CoinRepository,
    private readonly coinHistoriyRepo: CoinHistoryRepository,
    private readonly http: HttpService,
  ) {
    // setInterval(async () => {
    //   const coin = await this.coinRepository.getCoinList();
    //   const data = await this.getBinance(coin);
    //   const historyDtos = CoinValueDto.fromEntities(data, coin);
    //   const historyEntities = CoinValueDto.toEntities(historyDtos);
    //   await this.coinRepository.updateCoinByREST(historyEntities);
    // }, 60000);
    ///------------//
    setInterval(async () => {
      const date = Math.floor(new Date().getTime() / 1000);
      const oneHourBefore = await this.coinHistoriyRepo.getBeforePrice(
        date - ONEHOUR,
      );
      this.coinRepository.updateBeforePrice(oneHourBefore, 1);

      const fourHourBefore = await this.coinHistoriyRepo.getBeforePrice(
        date - FOURHOUR,
      );
      this.coinRepository.updateBeforePrice(fourHourBefore, 4);
      this.coinHistoriyRepo.removeBeforePrice(date - (FOURHOUR + ONEHOUR));
    }, 10000);
  }
}

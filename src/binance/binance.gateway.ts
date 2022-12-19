import { WebSocketGateway } from '@nestjs/websockets';
import Binance from 'binance-api-node';
import { CoinRepository } from 'src/market/entity/coin.repository';
import { CoinHistoryRepository } from 'src/market/entity/coinHistory.repository';

@WebSocketGateway()
export class BinanceGateway {
  binance;
  constructor(
    private readonly coinRepository: CoinRepository,
    private readonly coinHistoryRepository: CoinHistoryRepository,
  ) {
    this.binance = Binance();
    this.binance.ws.allMiniTickers((tickers) => {
      const filteredUS = tickers.filter((el) => el.symbol.includes('USDT'));
      this.coinRepository.updateCoinByWS(filteredUS);
      this.coinHistoryRepository.insertCoinHistoriesByWS(filteredUS);
    });
  }
}

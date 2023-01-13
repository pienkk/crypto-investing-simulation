import { ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MarketQueryDto } from './dto/market-query.dto';
import { CoinRepository } from './entity/coin.repository';

@WebSocketGateway(8080, { transposrts: ['websocket'] })
export class MarketGateway {
  constructor(private readonly coinRepository: CoinRepository) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('markets')
  async handleMessage(@MessageBody() query: MarketQueryDto) {
    const data = await this.coinRepository.getMarketData(query);

    const interval = setInterval(async () => {
      return await this.coinRepository.getMarketData(query);
    }, 1000);
    clearInterval(interval);

    this.server.emit('message', data);

    return data;
  }
}

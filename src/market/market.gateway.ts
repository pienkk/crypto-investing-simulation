import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CoinRepository } from './entity/coin.repository';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class MarketGateway {
  constructor(private readonly coinRepository: CoinRepository) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('markets')
  handleMessage(@MessageBody() data) {
    console.log(data);
    this.server.emit('message', data);
  }
}

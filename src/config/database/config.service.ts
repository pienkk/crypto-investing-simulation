import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Likes } from 'src/community/entity/like.entity';
import { Posts } from 'src/community/entity/post.entity';
import { Reply } from 'src/community/entity/reply.entity';
import { Coin } from 'src/market/entity/coin.entity';
import { CoinHistory } from 'src/market/entity/coinHistory.entity';
import { Trade } from 'src/trade/entity/trade.entity';
import { User } from 'src/user/entity/user.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: +this.configService.get<number>('DB_PORT'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_DATABASE'),
      logging: true,
      synchronize: true,
      // dropSchema: true,
      entities: [Posts, Reply, User, Coin, CoinHistory, Trade, Wallet, Likes],
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LikeEntity } from 'src/community/entity/like.entity';
import { PostEntity } from 'src/community/entity/post.entity';
import { ReplyEntity } from 'src/community/entity/reply.entity';
import { CoinEntity } from 'src/market/entity/coin.entity';
import { CoinHistoryEntity } from 'src/market/entity/coinHistory.entity';
import { TradeEntity } from 'src/trade/entity/trade.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { WalletEntity } from 'src/wallet/entity/wallet.entity';

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
      entities: [
        PostEntity,
        ReplyEntity,
        UserEntity,
        CoinEntity,
        CoinHistoryEntity,
        TradeEntity,
        WalletEntity,
        LikeEntity,
      ],
    };
  }
}

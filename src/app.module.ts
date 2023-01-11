import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfigModule } from './config/database/config.module';
import { MySqlConfigService } from './config/database/config.service';
import { CommunityModule } from './community/community.module';
import { UserModule } from './user/user.module';
import { MarketModule } from './market/market.module';
import { BinanceModule } from './binance/binance.module';
import { TradeModule } from './trade/trade.module';
import { WalletModule } from './wallet/wallet.module';
import { RankingModule } from './ranking/ranking.module';
import { GlobalExceptionFilter } from 'src/util/exception/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [MySqlConfigModule],
      useClass: MySqlConfigService,
      inject: [MySqlConfigService],
    }),
    CommunityModule,
    UserModule,
    MarketModule,
    BinanceModule,
    TradeModule,
    WalletModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}

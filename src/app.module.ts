import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfigModule } from './config/database/config.module';
import { MySqlConfigService } from './config/database/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev' ? './env/dev.env' : './env/test.env',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Posts } from 'src/community/entity/post.entity';
import { Reply } from 'src/community/entity/reply.entity';
import { User } from 'src/user/entity/user.entity';

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
      entities: [Posts, Reply, User],
    };
  }
}

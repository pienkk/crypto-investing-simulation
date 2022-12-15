import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { UserRepository } from './entity/user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
})
export class UserModule {}

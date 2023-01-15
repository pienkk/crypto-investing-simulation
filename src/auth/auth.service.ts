import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/entity/user.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async tokenValidateUser(payload: JwtPayload): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id: payload.id });
  }
}

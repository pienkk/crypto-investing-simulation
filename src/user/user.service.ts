import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(): Promise<{ accessToken: string; userId: number }> {
    const user = await this.userRepository.findOneBy({ id: 1 });
    const payload: JwtPayload = { id: user.id, email: user.email };

    return { accessToken: this.jwtService.sign(payload), userId: user.id };
  }
}

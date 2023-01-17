import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // 로그인 구현전 테스트
  signIn(): Promise<{ accessToken: string; userId: number }> {
    return this.userService.signIn();
  }
}

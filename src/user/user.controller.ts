import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResponseMoneyRankDto } from 'src/ranking/dto/response.moneyRank.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // 로그인 구현전 테스트
  signIn(
    @Query('userId') userId: number,
  ): Promise<{ accessToken: string; userId: number }> {
    return this.userService.signIn(userId);
  }

  @Get(':userId')
  getUserInfo(@Param('userId') userId: number): Promise<ResponseMoneyRankDto> {
    return this.userService.getUserInfo(userId);
  }
}

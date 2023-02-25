import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostListDto } from 'src/community/dto/response-post.dto';
import { ResponseReplyDto } from 'src/community/dto/response-reply.dto';
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

  @Get(':userId/posts')
  getUserPosts(@Param('userId') userId: number): Promise<PostListDto> {
    return this.userService.getUserPosts(userId);
  }

  @Get(':userId/replies')
  getUserReplies(@Param('userId') userId: number): Promise<ResponseReplyDto[]> {
    return this.userService.getUserReplies(userId);
  }
}

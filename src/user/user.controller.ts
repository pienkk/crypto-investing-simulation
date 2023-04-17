import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ResponseMoneyRankDto } from 'src/ranking/dto/response.moneyRank.dto';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PostListDto } from 'src/community/dto/response-post.dto';
import { QueryDto } from 'src/community/dto/community-query.dto';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { Posts } from 'src/community/entity/post.entity';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // 로그인 구현전 테스트
  signIn(
    @Query('userId') userId: number,
  ): Promise<{ accessToken: string; userId: number }> {
    return this.userService.signIn(userId);
  }

  @Get('posts')
  @ApiOperation({
    summary: '내가 작성한 게시글 조회 API',
    description: '내가 작성한 게시글 조회 API',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [Posts] })
  getMyDeletePosts(@CurrentUser() user: JwtPayload): Promise<Posts[]> {
    console.log(user);
    return this.userService.getMyDeletePosts(user.id);
  }

  @Get(':userId')
  getUserInfo(@Param('userId') userId: number): Promise<ResponseMoneyRankDto> {
    return this.userService.getUserInfo(userId);
  }
}

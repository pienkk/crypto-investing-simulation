import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResponseMoneyRankDto } from 'src/ranking/dto/response.moneyRank.dto';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { RequestSignInDto } from './dto/request-user.dto';
import { ResponseSignInDto } from './dto/response-user.dto';
import { ResponsePostDto } from 'src/community/dto/Response-post.dto';
import { Try, createResponseForm } from 'src/types';
import {
  responseArraySchema,
  responseBooleanSchema,
  responseObjectSchema,
} from 'src/types/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('posts')
  @ApiOperation({
    summary: '삭제된 게시글 조회 API',
    description: '내가 작성한 게시글 중 삭제한 게시글을 조회한다.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(ResponsePostDto)
  @ApiResponse({
    status: 200,
    schema: responseArraySchema(ResponsePostDto),
  })
  async getMyDeletePosts(
    @CurrentUser() user: JwtPayload,
  ): Promise<Try<ResponsePostDto[]>> {
    const posts = await this.userService.getMyDeletePosts(user.id);

    return createResponseForm(posts);
  }

  @Post('check')
  @ApiOperation({
    summary: '닉네임 중복체크 API',
    description: '해당 닉네임이 중복되어 있는지 확인한다 (중복가입불가)',
  })
  @ApiResponse({
    status: 200,
    schema: responseBooleanSchema(),
  })
  async checkNickname(
    @Body('nickname') nickname: string,
  ): Promise<Try<boolean>> {
    const isNickname = await this.userService.checkNickname(nickname);

    return createResponseForm(isNickname);
  }

  @Get(':userId')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '유저ID에 해당하는 유저 정보를 조회한다.',
  })
  @ApiExtraModels(ResponseMoneyRankDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponseMoneyRankDto),
  })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async getUserInfo(
    @Param('userId') userId: number,
  ): Promise<Try<ResponseMoneyRankDto>> {
    const user = await this.userService.getUserInfo(userId);

    return createResponseForm(user);
  }

  @Post('social')
  @ApiOperation({
    summary: '소셜 로그인 API',
    description: '소셜 로그인 API',
  })
  @ApiExtraModels(ResponseSignInDto)
  @ApiBody({ type: RequestSignInDto })
  @ApiResponse({ status: 200, schema: responseObjectSchema(ResponseSignInDto) })
  async socialLogin(
    @Body() socialLoginDto: RequestSignInDto,
  ): Promise<Try<ResponseSignInDto>> {
    const user = await this.userService.socialLogin(socialLoginDto);

    return createResponseForm(user);
  }
}

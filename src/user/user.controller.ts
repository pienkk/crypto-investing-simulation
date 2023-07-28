import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { RequestSignInDto } from './dto/request-user.dto';
import {
  ResponseSignInDto,
  ResponseUserCountDto,
  ResponseUserInfoDto,
} from './dto/response-user.dto';
import { ResponsePostPageNationDto } from 'src/community/dto/response-post.dto';
import { Try, createResponseForm } from 'src/types';
import {
  responseBooleanSchema,
  responseErrorSchema,
  responseObjectSchema,
} from 'src/types/swagger';
import { PageNationDto } from 'src/community/dto/request-query.dto';

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
  @ApiExtraModels(ResponsePostPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostPageNationDto),
  })
  @ApiNotFoundResponse({
    description: '유저 정보가 없을 경우',
    schema: responseErrorSchema('유저가 존재하지 않습니다.'),
  })
  async getMyDeletePosts(
    @CurrentUser() user: JwtPayload,
    @Query() pageNation: PageNationDto,
  ): Promise<Try<ResponsePostPageNationDto>> {
    const posts = await this.userService.getMyDeletePosts(user.id, pageNation);

    return createResponseForm(posts);
  }

  @Post('check')
  @ApiOperation({
    summary: '닉네임 중복체크 API',
    description:
      '해당 닉네임이 중복되어 있는지 확인한다. 중복된 유저가 없으면 true를 반환한다.',
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

  @Get('count')
  @ApiOperation({
    summary: '유저 수 조회 API',
    description: '현재 가입되어 있는 유저수를 조회한다.',
  })
  @ApiExtraModels(ResponseUserCountDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponseUserCountDto),
  })
  async getUserCount(): Promise<Try<ResponseUserCountDto>> {
    const count = await this.userService.getUserCount();

    return createResponseForm(count);
  }

  @Get(':userId')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '유저ID에 해당하는 유저 정보를 조회한다.',
  })
  @ApiExtraModels(ResponseUserInfoDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponseUserInfoDto),
  })
  @ApiNotFoundResponse({
    description: '유저 정보가 없을 경우',
    schema: responseErrorSchema('유저가 존재하지 않습니다.'),
  })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async getUserInfo(
    @Param('userId') userId: number,
  ): Promise<Try<ResponseUserInfoDto>> {
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
  @ApiNotFoundResponse({
    description: '유저 정보가 없을 경우',
    schema: responseErrorSchema('유저가 존재하지 않습니다.'),
  })
  async socialLogin(
    @Body() socialLoginDto: RequestSignInDto,
  ): Promise<Try<ResponseSignInDto>> {
    const user = await this.userService.socialLogin(socialLoginDto);

    return createResponseForm(user);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import {
  RequestCreatePostDto,
  RequestDeletePostDto,
  RequestUpdatePostDto,
} from './dto/Request-post.dto';
import {
  RequestCreateReplyDto,
  RequestDeleteReplyDto,
  RequestUpdateReplyDto,
} from './dto/Request-reply.dto';
import {
  PageNationDto,
  RequestGetPostsQueryDto,
} from './dto/Request-query.dto';
import {
  ResponsePostPageNationDto,
  ResponseCreatePostDto,
  ResponsePostDetailDto,
} from './dto/Response-post.dto';
import {
  ResponseReplyByUserPageNationDto,
  ResponseReplyDto,
} from './dto/Response-reply.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { OptionalJwtAuthGuard } from 'src/auth/security/optionalAuth.guard';
import {
  RequestCreateLikeDto,
  RequestDeleteLikeDto,
} from './dto/Request-like.dto';
import { createResponseForm, Try } from 'src/types';
import {
  responseArraySchema,
  responseBooleanSchema,
  responseErrorSchema,
  responseObjectSchema,
} from 'src/types/swagger';
import { ResponseDeleteLikesDto } from './dto/Response-like-dto';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({
    summary: '커뮤니티 게시글 목록 조회 API',
    description:
      '게시글 목록을 검색한다. query parameter를 이용한 페이지네이션 지원',
  })
  @ApiExtraModels(ResponsePostPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostPageNationDto),
  })
  async getPosts(
    @Query() pageNation: RequestGetPostsQueryDto,
  ): Promise<Try<ResponsePostPageNationDto>> {
    const posts = await this.communityService.getPosts(pageNation);

    return createResponseForm(posts);
  }

  @Get(':postId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: '커뮤니티 상세글 조회 API',
    description: '입력받은 게시글을 조회하고 조회수를 증가시킨다.',
  })
  @ApiExtraModels(ResponsePostDetailDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostDetailDto),
  })
  @ApiNotFoundResponse({
    description: '게시글이 존재하지 않을 경우',
    schema: responseErrorSchema('게시글을 찾을 수 없습니다.'),
  })
  async getPostDetail(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
  ): Promise<Try<ResponsePostDetailDto>> {
    const post = await this.communityService.getPostDetail(postId, user.id);

    return createResponseForm(post);
  }

  @Post()
  @ApiOperation({
    summary: '커뮤니티 게시글 생성 API',
    description: '게시글을 생성하고 게시글 id를 반환한다.',
  })
  @ApiExtraModels(ResponseCreatePostDto)
  @ApiResponse({
    status: 201,
    schema: responseObjectSchema(ResponseCreatePostDto),
  })
  @ApiBody({ type: RequestCreatePostDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @CurrentUser() user: JwtPayload,
    @Body() createPostDto: RequestCreatePostDto,
  ): Promise<Try<ResponseCreatePostDto>> {
    const post = await this.communityService.createPost(createPostDto, user.id);

    return createResponseForm(post);
  }

  @Patch(':postId')
  @ApiOperation({
    summary: '커뮤니티 게시글 수정 API',
    description: '게시글을 수정하고 결과 값을 반환한다.',
  })
  @ApiExtraModels(ResponseCreatePostDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponseCreatePostDto),
  })
  @ApiNotFoundResponse({
    description: '수정하고자 하는 게시글이 존재하지 않을 때',
    schema: responseErrorSchema('게시글을 찾을 수 없습니다.'),
  })
  @ApiBadRequestResponse({
    description: '게시글을 수정할 권한이 없을 때',
    schema: responseErrorSchema('게시글을 수정할 권한이 없습니다.'),
  })
  @ApiBody({ type: RequestUpdatePostDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
    @Body() updatePostDto: RequestUpdatePostDto,
  ): Promise<Try<ResponseCreatePostDto>> {
    const responsePostId = await this.communityService.updatePost(
      postId,
      user.id,
      updatePostDto,
    );

    return createResponseForm(responsePostId);
  }

  @Delete('post')
  @ApiOperation({
    summary: '커뮤니티 게시글 삭제 API',
    description: '게시글을 삭제하고 결과값을 반환한다.',
  })
  @ApiResponse({ status: 204, schema: responseBooleanSchema() })
  @ApiBadRequestResponse({
    description: '권한이 없는 게시글이 존재할 때',
    schema: responseErrorSchema(
      '삭제 요청된 게시글 중 권한이 없는 게시글이 존재합니다.',
    ),
  })
  @ApiBearerAuth()
  @ApiBody({ type: RequestDeletePostDto })
  @UseGuards(JwtAuthGuard)
  async removePost(
    @CurrentUser() user: JwtPayload,
    @Body() requestDeletePostDto: RequestDeletePostDto,
  ): Promise<Try<boolean>> {
    const boolean = await this.communityService.removePost(
      requestDeletePostDto,
      user.id,
    );

    return createResponseForm(boolean);
  }

  @Get('post/user/:userId')
  @ApiOperation({
    summary: '유저 게시글 조회 API',
    description: '특정 유저가 작성한 게시글 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponsePostPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostPageNationDto),
  })
  @ApiNotFoundResponse({
    description: '유저가 존재하지 않을 때',
    schema: responseErrorSchema('유저를 찾을 수 없습니다.'),
  })
  async getUserPosts(
    @Param('userId') userId: number,
    @Query() pageNation: PageNationDto,
  ): Promise<Try<ResponsePostPageNationDto>> {
    const posts = await this.communityService.getUserPosts(userId, pageNation);

    return createResponseForm(posts);
  }

  @Get('reply/:postId')
  @ApiOperation({
    summary: '게시글 댓글 조회 API',
    description: '특정 게시글에 대한 댓글 리스트를 조회한다.',
  })
  @ApiExtraModels(ResponseReplyDto)
  @ApiResponse({ status: 200, schema: responseArraySchema(ResponseReplyDto) })
  @ApiNotFoundResponse({
    description: '게시글이 존재하지 않을 때',
    schema: responseErrorSchema('게시글을 찾을 수 없습니다.'),
  })
  async getReplies(
    @Param('postId') postId: number,
  ): Promise<Try<ResponseReplyDto[]>> {
    const replies = await this.communityService.getReplies(postId);

    return createResponseForm(replies);
  }

  @Post('reply')
  @ApiOperation({
    summary: '게시글 댓글 작성 API',
    description: '댓글을 생성하고 해당 게시글의 댓글 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseReplyDto)
  @ApiResponse({ status: 201, schema: responseArraySchema(ResponseReplyDto) })
  @ApiNotFoundResponse({
    description: '게시글이 존재하지 않을 때',
    schema: responseErrorSchema('게시글이 존재하지 않습니다'),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createReply(
    @CurrentUser() user: JwtPayload,
    @Body() createReplyDto: RequestCreateReplyDto,
  ): Promise<Try<ResponseReplyDto[]>> {
    const replies = await this.communityService.createReply(
      createReplyDto,
      user.id,
    );

    return createResponseForm(replies);
  }

  @Patch('reply/:replyId')
  @ApiOperation({
    summary: '게시글 댓글 수정 API',
    description: '댓글을 수정하고 결과 값을 반환한다.',
  })
  @ApiBody({ type: RequestUpdateReplyDto })
  @ApiResponse({ status: 200, schema: responseBooleanSchema() })
  @ApiNotFoundResponse({
    description: '댓글이 존재하지 않을 때',
    schema: responseErrorSchema('댓글을 찾을 수 없습니다.'),
  })
  @ApiBadRequestResponse({
    description: '댓글을 작성한 유저가 아닐 때',
    schema: responseErrorSchema('댓글에 대한 권한이 없습니다..'),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateReply(
    @CurrentUser() user: JwtPayload,
    @Param('replyId') replyId: number,
    @Body() updateReplyDto: RequestUpdateReplyDto,
  ): Promise<Try<boolean>> {
    const boolean = await this.communityService.updateReply(
      replyId,
      user.id,
      updateReplyDto,
    );

    return createResponseForm(boolean);
  }

  @Delete('reply')
  @ApiOperation({
    summary: '게시글 댓글 삭제 API',
    description: '댓글을 삭제하고 결과 값을 반환한다.',
  })
  @ApiResponse({ status: 204, schema: responseBooleanSchema() })
  @ApiBadRequestResponse({
    description: '삭제 요청 리스트 중 권한이 없는 댓글이 존재할 때',
    schema: responseErrorSchema(
      '삭제 요청된 댓글 중 권한이 없는 댓글이 존재합니다.',
    ),
  })
  @ApiBearerAuth()
  @ApiBody({ type: RequestDeleteReplyDto })
  @UseGuards(JwtAuthGuard)
  async removeReply(
    @CurrentUser() user: JwtPayload,
    @Body() requestDeleteReplyDto: RequestDeleteReplyDto,
  ): Promise<Try<boolean>> {
    const boolean = await this.communityService.removeReply(
      requestDeleteReplyDto,
      user.id,
    );

    return createResponseForm(boolean);
  }

  @Get('reply/user/:userId')
  @ApiOperation({
    summary: '유저 댓글 조회 API',
    description: '특정 유저가 작성한 댓글 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseReplyByUserPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponseReplyByUserPageNationDto),
  })
  @ApiNotFoundResponse({
    description: '유저가 존재하지 않을 때',
    schema: responseErrorSchema('유저를 찾을 수 없습니다.'),
  })
  async getUserReplies(
    @Param('userId') userId: number,
    @Query() pageNation: PageNationDto,
  ): Promise<Try<ResponseReplyByUserPageNationDto>> {
    const replies = await this.communityService.getUserReplies(
      userId,
      pageNation,
    );

    return createResponseForm(replies);
  }

  @Get('reply/post/user/:userId')
  @ApiOperation({
    summary: '유저가 작성한 댓글의 게시글 조회 API',
    description: '유저가 작성한 댓글의 게시글 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponsePostPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostPageNationDto),
  })
  @ApiNotFoundResponse({
    description: '유저가 존재하지 않을 때',
    schema: responseErrorSchema('유저를 찾을 수 없습니다.'),
  })
  async getUserReplyPosts(
    @Param('userId') userId: number,
    @Query() pageNation: RequestGetPostsQueryDto,
  ): Promise<Try<ResponsePostPageNationDto>> {
    const posts = await this.communityService.getUserReplyPosts(
      userId,
      pageNation,
    );

    return createResponseForm(posts);
  }

  @Post('like/:postId')
  @ApiOperation({
    summary: '게시글 좋아요/싫어요 추가 API',
    description:
      '게시글에 좋아요/싫어요를 한 후 해당 게시글 상세 정보를 반환한다.',
  })
  @ApiExtraModels(ResponsePostDetailDto)
  @ApiResponse({
    status: 201,
    schema: responseObjectSchema(ResponsePostDetailDto),
  })
  @ApiNotFoundResponse({
    description: '게시글이 존재하지 않을 때',
    schema: responseErrorSchema('게시글을 찾을 수 없습니다.'),
  })
  @ApiBadRequestResponse({
    description: '같은 상태의 좋아요/싫어요 요청을 할 경우',
    schema: responseErrorSchema('이전과 같은 상태의 좋아요/싫어요 요청입니다.'),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createLike(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
    @Body() createLikeDto: RequestCreateLikeDto,
  ): Promise<Try<ResponsePostDetailDto>> {
    const post = await this.communityService.createLike(
      user.id,
      postId,
      createLikeDto,
    );

    return createResponseForm(post);
  }

  @Delete('like')
  @ApiOperation({
    summary: '게시글 좋아요/싫어요 다중 삭제 API',
    description:
      '게시글에 했던 좋아요/싫어요 기록을 삭제한 후 삭제한 게시글 id 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseDeleteLikesDto)
  @ApiResponse({
    status: 204,
    schema: responseObjectSchema(ResponseDeleteLikesDto),
  })
  @ApiNotFoundResponse({
    description: '좋아요/싫어요를 하지 않은 게시글이 존재할 때',
    schema: responseErrorSchema(
      '좋아요/싫어요를 하지 않은 게시글이 포함되어 있습니다.',
    ),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteLikeByPost(
    @CurrentUser() user: JwtPayload,
    @Body() requestDeleteLikeDto: RequestDeleteLikeDto,
  ): Promise<Try<ResponseDeleteLikesDto>> {
    const deletedPostIds = await this.communityService.deleteLikeByPosts(
      user.id,
      requestDeleteLikeDto,
    );

    return createResponseForm(deletedPostIds);
  }
  @Delete('like/:postId')
  @ApiOperation({
    summary: '게시글 좋아요/싫어요 삭제 API',
    description:
      '게시글에 했던 좋아요/싫어요 기록을 삭제한 후 게시글 상세 정보를 반환한다.',
  })
  @ApiExtraModels(ResponsePostDetailDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostDetailDto),
  })
  @ApiNotFoundResponse({
    description: '좋아요/싫어요 한 이력이 없을 경우',
    schema: responseErrorSchema('좋아요/싫어요 한 이력이 없습니다.'),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteLike(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
  ): Promise<Try<ResponsePostDetailDto>> {
    const post = await this.communityService.deleteLike(user.id, postId);

    return createResponseForm(post);
  }

  @Get('like/user/:userId')
  @ApiOperation({
    summary: '유저 좋아요한 게시글 조회 API',
    description: '특정 유저가 좋아요 한 게시글 리스트를 조회한다.',
  })
  @ApiExtraModels(ResponsePostPageNationDto)
  @ApiResponse({
    status: 200,
    schema: responseObjectSchema(ResponsePostPageNationDto),
  })
  @ApiNotFoundResponse({
    description: '유저가 존재하지 않을 경우',
    schema: responseErrorSchema('유저를 찾을 수 없습니다.'),
  })
  async getUserLikes(
    @Param('userId') userId: number,
    @Query() pageNation: PageNationDto,
  ): Promise<Try<ResponsePostPageNationDto>> {
    const posts = await this.communityService.getUserLikes(userId, pageNation);

    return createResponseForm(posts);
  }
}

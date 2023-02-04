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
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto, UpdateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/community-query.dto';
import {
  PostDetailDto,
  PostListDto,
  ResponsePostsDto,
} from './dto/response-post.dto';
import { ResponseReplyDto } from './dto/response-reply.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({
    summary: '커뮤니티 게시글 목록 조회 API',
    description: '게시글 검색, query parameter를 이용한 페이지네이션',
  })
  @ApiOkResponse({ type: PostListDto })
  @ApiQuery({ type: QueryDto })
  getPosts(@Query() pageNation: QueryDto): Promise<PostListDto> {
    return this.communityService.getPosts(pageNation);
  }

  @Get(':postId')
  @ApiOperation({
    summary: '커뮤니티 상세글 조회 API',
    description: '게시글 상세 조회, 댓글 조회',
  })
  @ApiOkResponse({ type: PostDetailDto })
  @ApiNotFoundResponse({ description: 'Post not found' })
  // @UseGuards(JwtAuthGuard)
  getPostDetail(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
  ): Promise<ResponsePostsDto> {
    console.log(user);
    return this.communityService.getPostDetail(postId);
  }

  @Post()
  @ApiOperation({
    summary: '커뮤니티 게시글 생성 API',
    description: '게시글을 생성한다.',
  })
  @ApiCreatedResponse({ description: '{ status: "good" }' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @CurrentUser() user: JwtPayload,
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ status: string; postId: number }> {
    const post = await this.communityService.createPost(createPostDto, user.id);

    return { status: 'good', postId: post.id };
  }

  @Patch(':postId')
  @ApiOperation({
    summary: '커뮤니티 게시글 수정 API',
    description: '게시글을 수정한다.',
  })
  @ApiOkResponse({ description: '{ status: "true" }' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBadRequestResponse({ description: "Don't have post permisson" })
  @ApiBody({ type: UpdatePostDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updatePost(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.communityService.updatePost(postId, user.id, updatePostDto);
  }

  @Delete(':postId')
  @ApiOperation({
    summary: '커뮤니티 게시글 삭제 API',
    description: '게시글을 삭제한다.',
  })
  @ApiOkResponse({ description: '{ status: "true" }' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBadRequestResponse({ description: "Don't have post permisson" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removePost(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: number,
  ): Promise<{ status: boolean }> {
    return this.communityService.removePost(postId, user.id);
  }

  @Get('reply/:postId')
  @ApiOperation({
    summary: '게시글 댓글 조회 API',
    description: '댓글 조회',
  })
  @ApiOkResponse({ description: 'Response Success', type: [ResponseReplyDto] })
  @ApiNotFoundResponse({ description: 'Post not found' })
  getReplies(@Param('postId') postId: number): Promise<ResponseReplyDto[]> {
    return this.communityService.getReplies(postId);
  }

  @Post('reply')
  @ApiOperation({
    summary: '게시글 댓글 작성 API',
    description: '댓글을 생성한다',
  })
  @ApiCreatedResponse({
    description: '댓글을 생성한다',
    type: [ResponseReplyDto],
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createReply(
    @CurrentUser() user: JwtPayload,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<ResponseReplyDto[]> {
    return this.communityService.createReply(createReplyDto, user.id);
  }

  @Patch('reply/:replyId')
  @ApiOperation({
    summary: '게시글 댓글 수정 API',
    description: '댓글을 수정한다.',
  })
  @ApiBody({ type: UpdateReplyDto })
  @ApiOkResponse({ description: '{ status: true }' })
  @ApiNotFoundResponse({ description: 'This reply does not exist' })
  @ApiBadRequestResponse({ description: "Don't have reply permisson" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateReply(
    @CurrentUser() user: JwtPayload,
    @Param('replyId') replyId: number,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<{ status: boolean }> {
    return this.communityService.updateReply(replyId, user.id, updateReplyDto);
  }

  @Delete('reply/:replyId')
  @ApiOperation({
    summary: '게시글 댓글 삭제 API',
    description: '댓글을 삭제한다.',
  })
  @ApiOkResponse({ description: '{ status: true }' })
  @ApiNotFoundResponse({ description: 'This reply does not exist' })
  @ApiBadRequestResponse({ description: "Don't have reply permisson" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeReply(
    @CurrentUser() user: JwtPayload,
    @Param('replyId') replyId: number,
  ): Promise<{ status: boolean }> {
    return this.communityService.removeReply(replyId, user.id);
  }
}

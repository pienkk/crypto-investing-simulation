import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/community-query.dto';
import {
  PostDetailDto,
  PostListDto,
  ResponsePostsDto,
} from './dto/response-post.dto';
import { ReplyListDto } from './dto/response-reply.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entity/post.entity';
import { Reply } from './entity/reply.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

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
  getPostDetail(@Param('postId') postId: number): Promise<PostDetailDto> {
    return this.communityService.getPostDetail(postId);
  }

  @Post()
  @ApiOperation({
    summary: '커뮤니티 게시글 생성 API',
    description: '게시글을 생성한다.',
  })
  @ApiCreatedResponse({ description: '게시글을 생성한다.', type: Posts })
  @ApiBody({ type: CreatePostDto })
  createPost(@Body() createPostDto: CreatePostDto): Promise<Posts> {
    return this.communityService.createPost(createPostDto);
  }

  @Patch(':postId')
  @ApiOperation({
    summary: '커뮤니티 게시글 수정 API',
    description: '게시글을 수정한다.',
  })
  @ApiBody({ type: UpdatePostDto })
  updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.communityService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  @ApiProperty({
    summary: '커뮤니티 게시글 삭제 API',
    description: '게시글을 삭제한다.',
  })
  removePost(@Param('postId') postId: number): Promise<void> {
    return this.communityService.removePost(postId);
  }

  @Get('reply/:postId')
  getReplies(
    @Param('postId') postId: number,
    @Query() pageNation: QueryDto,
  ): Promise<ReplyListDto> {
    return this.communityService.getReplies(postId, pageNation);
  }

  @Post('reply')
  createReply(@Body() createReplyDto: CreateReplyDto): Promise<Reply> {
    return this.communityService.createReply(createReplyDto);
  }

  @Patch('reply/:replyId')
  updateReply(
    @Param('replyId') replyId: number,
    @Body() updateReplyDto: CreateReplyDto,
  ): Promise<void> {
    return this.communityService.updateReply(replyId, updateReplyDto);
  }

  @Delete('reply/:replyId')
  removeReply(@Param('replyId') replyId: number): Promise<void> {
    return this.communityService.removeReply(replyId);
  }
}

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
import { PostDetailDto, PostListDto } from './dto/response-post.dto';
import { ReplyListDto } from './dto/response-reply.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entity/post.entity';
import { Reply } from './entity/reply.entity';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  getPosts(@Query() pageNation: QueryDto): Promise<PostListDto> {
    return this.communityService.getPosts(pageNation);
  }

  @Get(':postId')
  getPostDetail(@Param('postId') postId: number): Promise<PostDetailDto> {
    return this.communityService.getPostDetail(postId);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<Posts> {
    return this.communityService.createPost(createPostDto);
  }

  @Patch(':postId')
  updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.communityService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
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

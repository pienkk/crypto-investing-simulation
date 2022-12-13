import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { GetPostListsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDetail, Posts } from './entity/post.entity';
import { Reply } from './entity/reply.entity';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  getAll(@Query() pageNation: GetPostListsDto): Promise<[Posts[], number]> {
    return this.communityService.getPosts(pageNation);
  }

  @Get(':postId')
  getOne(@Param('postId') postId: number): Promise<PostDetail> {
    return this.communityService.getPostOne(postId);
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

  @Get('reply/:postId')
  getReplies(
    @Param('postId') postId: number,
    @Query() pageNation: GetPostListsDto,
  ): Promise<[Reply[], number]> {
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
}

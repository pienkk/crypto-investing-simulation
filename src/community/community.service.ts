import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { GetPostListsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDetail, Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { Reply } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';

@Injectable()
export class CommunityService {
  constructor(
    private postRepository: PostRepository,
    private replyRepository: ReplyRepository,
  ) {}

  getPosts(GetPostListsDto: GetPostListsDto): Promise<[Posts[], number]> {
    return this.postRepository.getPostLists(GetPostListsDto);
  }

  getPostOne(postId: number): Promise<PostDetail> {
    return this.postRepository.getOne(postId);
  }

  createPost(createPostDto: CreatePostDto): Promise<Posts> {
    const post = this.postRepository.createPost(createPostDto);
    return post;
  }

  updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<void> {
    this.postRepository.updatePost(postId, updatePostDto);
    return;
  }

  getReplies(
    postId: number,
    pageNation: GetPostListsDto,
  ): Promise<[Reply[], number]> {
    return this.replyRepository.getReplyLists(postId, pageNation);
  }

  createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const reply = this.replyRepository.createReply(createReplyDto);
    return reply;
  }

  updateReply(replyId: number, updateReplyDto: CreateReplyDto): Promise<void> {
    return this.replyRepository.updateReply(replyId, updateReplyDto);
  }
}

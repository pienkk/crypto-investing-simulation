import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/community-query.dto';
import {
  PostDetailDto,
  PostListDto,
  ResponsePostsDto,
} from './dto/response-post.dto';
import { ReplyListDto, ResponseReplyDto } from './dto/response-reply.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { Reply } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';

@Injectable()
export class CommunityService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly replyRepository: ReplyRepository,
  ) {}

  async postValidation(postId: number, userId?: number): Promise<Posts> {
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (userId && post.userId !== userId) {
      throw new HttpException(
        "Don't have post permisson",
        HttpStatus.BAD_REQUEST,
      );
    }
    return post;
  }

  async getPosts(GetPostListsDto: QueryDto): Promise<PostListDto> {
    const [postList, number] = await this.postRepository.getPostLists(
      GetPostListsDto,
    );
    const post = ResponsePostsDto.fromEntities(postList);
    const responsePosts: PostListDto = { post, number };

    return responsePosts;
  }

  async getPostDetail(postId: number): Promise<ResponsePostsDto> {
    await this.postValidation(postId);
    const postDetail = await this.postRepository.getPostDetail(postId);

    this.postRepository.update(postId, { hits: () => 'hits + 1' });

    return ResponsePostsDto.fromEntity(postDetail);
  }

  async createPost(createPostDto: CreatePostDto): Promise<Posts> {
    const post = this.postRepository.create(createPostDto);

    return await this.postRepository.save(post);
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    const { userId } = updatePostDto;
    await this.postValidation(postId, userId);

    const result = await this.postRepository.update(postId, updatePostDto);
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  async removePost(postId: number): Promise<boolean> {
    const post = await this.postValidation(postId);

    const result = await this.postRepository.delete(post);
    if (result.affected !== 1) {
      throw new HttpException('This post does not exist', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async getReplies(postId: number, queryDto: QueryDto): Promise<ReplyListDto> {
    await this.postValidation(postId);

    const [replies, number] = await this.replyRepository.getReplyLists(
      postId,
      queryDto,
    );

    const reply = ResponseReplyDto.fromEntities(replies);
    const responseReplyList: ReplyListDto = { reply, number };

    return responseReplyList;
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { postId } = createReplyDto;
    await this.postValidation(postId);

    const reply = this.replyRepository.create(createReplyDto);
    return await this.replyRepository.save(reply);
  }

  async replyValidation(replyId: number): Promise<Reply> {
    // JWT 로직 추가 후 유저 아이디 검증 추가
    const reply = await this.replyRepository.findOneBy({ id: replyId });

    if (!reply)
      throw new HttpException(
        'This reply does not exist.',
        HttpStatus.BAD_REQUEST,
      );

    return reply;
  }

  async updateReply(
    replyId: number,
    updateReplyDto: CreateReplyDto,
  ): Promise<boolean> {
    await this.replyValidation(replyId);

    const result = await this.replyRepository.update(replyId, updateReplyDto);
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  async removeReply(replyId: number): Promise<boolean> {
    await this.replyValidation(replyId);

    const result = await this.replyRepository.delete({ id: replyId });
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}

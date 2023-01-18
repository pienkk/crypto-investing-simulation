import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto, UpdateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/community-query.dto';
import { PostListDto, ResponsePostsDto } from './dto/response-post.dto';
import { ResponseReplyDto } from './dto/response-reply.dto';
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

    const post = ResponsePostsDto.fromEntity(postDetail);

    return ResponsePostsDto.hitsPlus(post);
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Posts> {
    const post = this.postRepository.create({ ...createPostDto, userId });

    return await this.postRepository.save(post);
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<boolean> {
    await this.postValidation(postId, userId);

    const result = await this.postRepository.update(postId, updatePostDto);
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  async removePost(
    postId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    const post = await this.postValidation(postId, userId);

    const result = await this.postRepository.delete(post.id);
    if (result.affected !== 1) {
      throw new HttpException('This post does not exist', HttpStatus.NOT_FOUND);
    }

    return { status: true };
  }

  async getReplies(postId: number): Promise<ResponseReplyDto[]> {
    await this.postValidation(postId);

    const replies = await this.replyRepository.getReplyLists(postId);

    return ResponseReplyDto.fromEntities(replies);
  }

  async createReply(
    createReplyDto: CreateReplyDto,
    userId: number,
  ): Promise<ResponseReplyDto[]> {
    const { postId } = createReplyDto;
    await this.postValidation(postId, userId);

    const reply = this.replyRepository.create({ ...createReplyDto, userId });
    await this.replyRepository.save(reply);

    const replies = await this.replyRepository.getReplyLists(postId);
    return ResponseReplyDto.fromEntities(replies);
  }

  async replyValidation(replyId: number, userId: number): Promise<Reply> {
    const reply = await this.replyRepository.findOneBy({ id: replyId });

    if (!reply)
      throw new HttpException(
        'This reply does not exist.',
        HttpStatus.BAD_REQUEST,
      );

    if (reply.userId !== userId) {
      throw new HttpException(
        "Don't have reply permisson",
        HttpStatus.BAD_REQUEST,
      );
    }

    return reply;
  }

  async updateReply(
    replyId: number,
    updateReplyDto: UpdateReplyDto,
    userId: number,
  ): Promise<boolean> {
    await this.replyValidation(replyId, userId);

    const result = await this.replyRepository.update(replyId, updateReplyDto);
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  async removeReply(
    replyId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    await this.replyValidation(replyId, userId);

    const result = await this.replyRepository.delete({ id: replyId });
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }
}

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
    private postRepository: PostRepository,
    private replyRepository: ReplyRepository,
  ) {}

  async getPosts(GetPostListsDto: QueryDto): Promise<PostListDto> {
    const [postList, number] = await this.postRepository.getPostLists(
      GetPostListsDto,
    );
    const post = ResponsePostsDto.fromEntities(postList);

    return { post, number };
  }

  async getPostDetail(postId: number): Promise<PostDetailDto> {
    const postDetail = await this.postRepository.getPostByOne(postId);
    if (!postDetail)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const [reply, number] = await this.replyRepository.getReplyLists(postId, {
      page: 1,
      number: 10,
    });

    const replies = ResponseReplyDto.fromEntities(reply);
    const post = ResponsePostsDto.fromEntity(postDetail);

    return { post, reply: replies, number };
  }

  createPost(createPostDto: CreatePostDto): Promise<Posts> {
    const post = this.postRepository.createPost(createPostDto);
    return post;
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const { userId } = updatePostDto;
    const postPermisson = await this.postRepository.getPostExistByUser(userId);
    if (!postPermisson)
      throw new HttpException(
        "Don't have post permisson",
        HttpStatus.BAD_REQUEST,
      );

    this.postRepository.updatePost(postId, updatePostDto);
    return;
  }

  async removePost(postId: number): Promise<void> {
    const post = await this.postRepository.getPostByOne(postId);
    if (!post)
      throw new HttpException(
        "Don't have permisson OR Not found post",
        HttpStatus.BAD_REQUEST,
      );
    return this.postRepository.removePost(post);
    // const result = await this.postRepository.removePost(postId);
    // if (result.affected)
    //   throw new HttpException('This post does not exist', HttpStatus.NOT_FOUND);
    return;
  }

  async getReplies(
    postId: number,
    pageNation: QueryDto,
  ): Promise<ReplyListDto> {
    const [replies, number] = await this.replyRepository.getReplyLists(
      postId,
      pageNation,
    );
    const reply = ResponseReplyDto.fromEntities(replies);
    return { reply, number };
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { postId } = createReplyDto;
    const postExist = await this.postRepository.getPostByOne(postId);
    if (!postExist)
      throw new HttpException(
        'This post does not exist.',
        HttpStatus.NOT_FOUND,
      );

    const reply = this.replyRepository.createReply(createReplyDto);
    return reply;
  }

  updateReply(replyId: number, updateReplyDto: CreateReplyDto): Promise<void> {
    const reply = this.replyRepository.getReplyExistByUser(replyId);
    if (!reply)
      throw new HttpException(
        'This reply does not exist.',
        HttpStatus.BAD_REQUEST,
      );

    return this.replyRepository.updateReply(replyId, updateReplyDto);
  }

  removeReply(replyId: number): Promise<void> {
    const reply = this.replyRepository.getReplyExistByUser(replyId);
    if (!reply)
      throw new HttpException(
        'This reply does not exist.',
        HttpStatus.BAD_REQUEST,
      );

    this.replyRepository.removeReply(replyId);
    return;
  }
}

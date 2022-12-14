import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/query.dto';
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

  getPosts(GetPostListsDto: QueryDto): Promise<[Posts[], number]> {
    return this.postRepository.getPostLists(GetPostListsDto);
  }

  async getPostOne(postId: number): Promise<Posts> {
    const post = await this.postRepository.getOne(postId);
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    return post;
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
    const post = await this.postRepository.getOne(postId);
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

  getReplies(postId: number, pageNation: QueryDto): Promise<[Reply[], number]> {
    return this.replyRepository.getReplyLists(postId, pageNation);
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { postId } = createReplyDto;
    const postExist = await this.postRepository.getOne(postId);
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

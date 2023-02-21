import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto, UpdateReplyDto } from './dto/create-reply.dto';
import { QueryDto } from './dto/community-query.dto';
import {
  PostListDto,
  ResponsePostDetailDto,
  ResponsePostsDto,
} from './dto/response-post.dto';
import { ResponseReplyDto } from './dto/response-reply.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { Reply } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entity/like.entity';
import { Repository } from 'typeorm';

/**
 * 커뮤니티 비즈니스 로직
 */
@Injectable()
export class CommunityService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly replyRepository: ReplyRepository,
    @InjectRepository(Likes)
    private readonly likeRepository: Repository<Likes>,
  ) {}

  // 게시글 유효성 검증 userId는 옵션값으로 유저의 유효성을 검증한다
  async postValidation(postId: number, userId?: number): Promise<Posts> {
    const post = await this.postRepository.findOneBy({ id: postId });

    // 게시글이 존재하지 않거나, soft delete상태인 경우
    if (!post || post.deleted_at) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    // 게시글을 작성한 유저가 아닐 경우
    if (userId && post.userId !== userId) {
      throw new HttpException(
        "Don't have post permisson",
        HttpStatus.BAD_REQUEST,
      );
    }

    return post;
  }

  // 게시글 리스트
  async getPosts(GetPostListsDto: QueryDto): Promise<PostListDto> {
    const [postList, number] = await this.postRepository.getPostLists(
      GetPostListsDto,
    );

    const post = ResponsePostsDto.fromEntities(postList);
    const responsePosts: PostListDto = { post, number };

    return responsePosts;
  }

  // 게시글 상세 정보
  async getPostDetail(
    postId: number,
    userId = 0,
    final?: boolean,
  ): Promise<ResponsePostDetailDto> {
    const postDetail = await this.postRepository.getPostDetail(postId);
    if (!postDetail) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const like = await this.likeRepository.findOneBy({ postId, userId });
    const likeCount = await this.likeRepository.countBy({
      postId,
      isLike: true,
    });
    const unlikeCount = await this.likeRepository.countBy({
      postId,
      isLike: false,
    });

    const post = ResponsePostDetailDto.fromEntity(
      postDetail,
      like,
      likeCount,
      unlikeCount,
    );
    if (final) return post;

    this.postRepository.update(postId, { hits: () => 'hits + 1' });

    return ResponsePostDetailDto.hitsPlus(post);
  }

  // 게시글 생성
  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Posts> {
    const post = this.postRepository.create({ ...createPostDto, userId });

    return await this.postRepository.save(post);
  }

  // 게시글 수정
  async updatePost(
    postId: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<{ status: boolean }> {
    await this.postValidation(postId, userId);

    const result = await this.postRepository.update(postId, updatePostDto);
    // 수정된 갯수가 1개가 아닐 경우
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }

  // 게시글 삭제
  async removePost(
    postId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    const post = await this.postValidation(postId, userId);

    post.deleted_at = new Date();
    const removePost = await this.postRepository.save(post);

    // soft delete가 되지 않았을 경우
    if (!removePost.deleted_at) {
      throw new HttpException('This post does not exist', HttpStatus.NOT_FOUND);
    }

    return { status: true };
  }

  // 게시글의 댓글 리스트 조회
  async getReplies(postId: number): Promise<ResponseReplyDto[]> {
    await this.postValidation(postId);

    const replies = await this.replyRepository.getReplyLists(postId);

    return ResponseReplyDto.fromEntities(replies);
  }

  // 댓글 생성
  async createReply(
    createReplyDto: CreateReplyDto,
    userId: number,
  ): Promise<ResponseReplyDto[]> {
    const { postId } = createReplyDto;
    await this.postValidation(postId);

    // 대댓글 작성 요청 시
    if (createReplyDto.replyId) {
      const reply = await this.replyRepository.findOneBy({
        id: createReplyDto.replyId,
      });

      // 대댓글 요청할 때 원본 댓글이 없는 경우
      if (!reply)
        throw new HttpException('Reply is not found', HttpStatus.NOT_FOUND);
    }

    const reply = this.replyRepository.create({ ...createReplyDto, userId });
    const savedReply = await this.replyRepository.save(reply);

    // 원본 댓글 작성시 자기 자신의 id를 replyId로 가진다
    if (!savedReply.replyId) {
      await this.replyRepository.save({
        ...savedReply,
        replyId: savedReply.id,
      });
    }

    const replies = await this.replyRepository.getReplyLists(postId);
    return ResponseReplyDto.fromEntities(replies);
  }

  // 댓글 유효성 검사 userId는 유저 검증로직으로 옵션
  async replyValidation(replyId: number, userId: number): Promise<Reply> {
    const reply = await this.replyRepository.findOneBy({ id: replyId });

    // 댓글이 존재하지 않거나, soft delete 상태일 경우
    if (!reply || reply.deleted_at)
      throw new HttpException(
        'This reply does not exist',
        HttpStatus.NOT_FOUND,
      );

    // 해당 댓글을 작성한 유저가 아닐 경우,
    if (reply.userId !== userId) {
      throw new HttpException(
        "Don't have reply permisson",
        HttpStatus.BAD_REQUEST,
      );
    }

    return reply;
  }

  // 댓글 수정
  async updateReply(
    replyId: number,
    userId: number,
    updateReplyDto: UpdateReplyDto,
  ): Promise<{ status: true }> {
    await this.replyValidation(replyId, userId);

    const result = await this.replyRepository.update(replyId, updateReplyDto);
    // 수정된 갯수가 1개가 아닐 경우
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }

  // 댓글 삭제
  async removeReply(
    replyId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    const reply = await this.replyValidation(replyId, userId);

    reply.deleted_at = new Date();

    const removedReply = await this.replyRepository.save(reply);
    // soft delete가 작동하지 않았을 경우
    if (!removedReply.deleted_at) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }

  // 좋아요 / 싫어요 추가
  async createLike(
    userId: number,
    postId: number,
    { isLike }: CreateLikeDto,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (like) {
      throw new HttpException('Already Like', HttpStatus.BAD_REQUEST);
    }

    await this.likeRepository.save({ userId, postId, isLike });

    return this.getPostDetail(postId, 0, true);
  }

  // 좋아요 / 싫어요 삭제
  async deleteLike(
    userId: number,
    postId: number,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (!like) {
      throw new HttpException("Don't find Like", HttpStatus.NOT_FOUND);
    }

    const result = await this.likeRepository.delete(like);

    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return this.getPostDetail(postId, 0, true);
  }
}

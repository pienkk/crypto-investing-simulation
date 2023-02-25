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

  /**
   * 게시글 id와 유저 id를 입력 받아 일치하는 게시글을 반환한다. (option: userId)
   * 1. 게시글 id만 들어올 경우 : 게시글이 존재하지 않을 경우 에러를 던지고, 게시글이 존재할 경우 게시글정보를 반환한다.
   * 2. 게시글 id와 유저 id가 같이 들어올 경우 : 해당 게시글의 작성한 유저와 일치하지 않을 경우 에러를 던지고, 일치할 경우 게시글 정보를 반환한다.
   * @param postId 게시글 id
   * @param userId 유저 id
   * @returns Posts 게시글 정보
   */
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

  /**
   * 검색에 필요한 데이터를 입력 받아, 해당하는 게시글 리스트와 검색에 대한 게시글 갯수를 반환한다.
   * @param GetPostListsDto 검색에 필요한 쿼리 데이터
   * @returns PostListDto 게시글 리스트
   */
  async getPosts(GetPostListsDto: QueryDto): Promise<PostListDto> {
    const [postList, number] = await this.postRepository.getPostLists(
      GetPostListsDto,
    );

    const post = ResponsePostsDto.fromEntities(postList);
    const responsePosts: PostListDto = { post, number };

    return responsePosts;
  }

  /**
   * 게시글 id를 받아 해당 게시글의 상세 정보를 반환한다.
   * 유저 id와 같이 입력될 경우 내가 해당 게시글에 좋아요를 했는지 여부 또한 알려 준다.
   * @param postId 게시글 id
   * @param userId 유저 id
   * @param update 값이 true일 경우 조회수를 올리지 않는다. (option)
   * @returns ResponsePostDetailDto 게시글 상세 정보
   */
  async getPostDetail(
    postId: number,
    userId = 0,
    update?: boolean,
  ): Promise<ResponsePostDetailDto> {
    const postDetail = await this.postValidation(postId);

    // 좋아요 여부, 좋아요, 싫어요 카운트
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
    if (update) return post;

    // 조회수 증가
    this.postRepository.update(postId, { hits: () => 'hits + 1' });

    return ResponsePostDetailDto.hitsPlus(post);
  }

  /**
   * 게시글생성에 필요한 정보와 유저 id를 받아 게시글을 생성한 후, 작성된 게시글 정보를 반환한다.
   * @param createPostDto 게시글 생성 정보
   * @param userId 유저 id
   * @returns Posts 게시글 정보
   */
  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Posts> {
    const post = this.postRepository.create({ ...createPostDto, userId });

    return await this.postRepository.save(post);
  }

  /**
   * 유저가 작성한 게시글일 경우 게시글을 수정하고, 상태 값을 반환한다.
   * @param postId 게시글 id
   * @param userId 유저 id
   * @param updatePostDto 게시글 수정 정보
   * @returns 게시글 수정 상태값
   */
  async updatePost(
    postId: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<{ status: boolean }> {
    await this.postValidation(postId, userId);

    // 게시글 수정
    const result = await this.postRepository.update(postId, updatePostDto);

    // 수정된 갯수가 1개가 아닐 경우
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }

  /**
   * 유저가 작성한 게시글일 경우 게시글을 삭제하고, 상태 값을 반환한다.
   * @param postId 게시글 id
   * @param userId 유저 id
   * @returns 게시글 삭제 상태 값
   */
  async removePost(
    postId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    const post = await this.postValidation(postId, userId);

    // 게시글 삭제 현재 시간 입력
    post.deleted_at = new Date();
    const removePost = await this.postRepository.save(post);

    // soft delete가 되지 않았을 경우
    if (!removePost.deleted_at) {
      throw new HttpException('This post does not exist', HttpStatus.NOT_FOUND);
    }

    return { status: true };
  }

  /**
   * 게시글에 해당하는 댓글리스트를 반환한다.
   * @param postId 게시글 id
   * @returns ResponseReplyDto[] 댓글 리스트
   */
  async getReplies(postId: number): Promise<ResponseReplyDto[]> {
    await this.postValidation(postId);

    const replies = await this.replyRepository.getReplyLists(postId);

    return ResponseReplyDto.fromEntities(replies);
  }

  /**
   * 게시글을 생성하고 해당 게시글에 댓글 리스트를 반환한다.
   * @param createReplyDto 게시글 생성 정보
   * @param userId 유저 Id
   * @returns ResponseReplyDto[] 댓글 리스트
   */
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

    // 댓글 생성
    const reply = this.replyRepository.create({ ...createReplyDto, userId });
    const savedReply = await this.replyRepository.save(reply);

    // 원본 댓글 작성시 자기 자신의 id를 replyId로 가진다
    if (!savedReply.replyId) {
      await this.replyRepository.save({
        ...savedReply,
        replyId: savedReply.id,
      });
    }

    // 댓글 리스트 조회 후 반환
    const replies = await this.replyRepository.getReplyLists(postId);
    return ResponseReplyDto.fromEntities(replies);
  }

  /**
   * 댓글 id와 유저 id를 입력 받아 일치하는 댓글을 반환한다. (option: userId)
   * 1. 댓글 id만 들어올 경우 : 댓글이 존재하지 않을 경우 에러를 던지고, 댓글 존재할 경우 댓글정보를 반환한다.
   * 2. 댓글 id와 유저 id가 같이 들어올 경우 : 해당 댓글의 작성한 유저와 일치하지 않을 경우 에러를 던지고, 일치할 경우 댓글 정보를 반환한다.
   * @param replyId 댓글 id
   * @param userId 유저 id
   * @returns Reply 댓글 정보
   */
  private async replyValidation(
    replyId: number,
    userId: number,
  ): Promise<Reply> {
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

  /**
   * 유저가 작성한 댓글일 경우 댓글을 수정하고 상태 값을 반환한다.
   * @param replyId 댓글 id
   * @param userId 유저 id
   * @param updateReplyDto 댓글 수정 정보
   * @returns 댓글 수정 상태 값
   */
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

  /**
   * 유저가 작성한 댓글일 경우 댓글을 삭제하고 상태 값을 반환한다.
   * @param replyId 댓글 id
   * @param userId 유저 id
   * @returns 댓글 삭제 상태 값
   */
  async removeReply(
    replyId: number,
    userId: number,
  ): Promise<{ status: boolean }> {
    const reply = await this.replyValidation(replyId, userId);

    // 댓글 soft delte
    reply.deleted_at = new Date();
    const removedReply = await this.replyRepository.save(reply);

    // soft delete가 작동하지 않았을 경우
    if (!removedReply.deleted_at) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    return { status: true };
  }

  /**
   * 유저 id와 게시글 id , 좋아요, 싫어요 여부를 받아 저장 한뒤, 해당 게시글에 대한 상세 정보를 반환한다.
   * isLike : true = 좋아요, isLike : false = 싫어요
   * @param userId 유저 id
   * @param postId 게시글 id
   * @param CreateLikeDto 좋아요 정보
   * @returns 게시글 상세 정보
   */
  async createLike(
    userId: number,
    postId: number,
    { isLike }: CreateLikeDto,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);

    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    // 이미 좋아요 / 싫어요 한 게시글일 경우
    if (like) {
      throw new HttpException('Already Like', HttpStatus.BAD_REQUEST);
    }

    await this.likeRepository.save({ userId, postId, isLike });

    // 게시글 정보 반환
    return this.getPostDetail(postId, userId, true);
  }

  /**
   * 유저가 해당 게시글에 좋아요 / 싫어요를 한 이력이 있을 경우, 해당 이력을 삭제하고 게시글 정보를 반환한다.
   * @param userId 유저 id
   * @param postId 게시글 id
   * @returns 게시글 상세 정보
   */
  async deleteLike(
    userId: number,
    postId: number,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    // 좋아요 / 싫어요 이력이 없을 경우
    if (!like) {
      throw new HttpException("Don't find Like", HttpStatus.NOT_FOUND);
    }

    const result = await this.likeRepository.delete(like);

    // 이력이 삭제되지 않았을 경우
    if (result.affected !== 1) {
      throw new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN);
    }

    // 게시글 정보 반환
    return this.getPostDetail(postId, userId, true);
  }
}

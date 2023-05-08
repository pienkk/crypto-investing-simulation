import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  RequestCreatePostDto,
  RequestDeletePostDto,
  RequestUpdatePostDto,
} from './dto/request-post.dto';
import {
  RequestCreateReplyDto,
  RequestDeleteReplyDto,
  RequestUpdateReplyDto,
} from './dto/request-reply.dto';
import {
  PageNationDto,
  RequestGetPostsQueryDto,
} from './dto/request-query.dto';
import {
  ResponsePostPageNationDto,
  ResponsePostDetailDto,
  ResponsePostDto,
  ResponseCreatePostDto,
} from './dto/response-post.dto';
import {
  ResponseReplyDto,
  ResponseReplyByUserDto,
  ResponseReplyByUserPageNationDto,
} from './dto/response-reply.dto';
import { Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { Reply } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';
import {
  RequestCreateLikeDto,
  RequestDeleteLikeDto,
} from './dto/request-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entity/like.entity';
import { Repository, In, MoreThan, LessThan } from 'typeorm';
import { UserRepository } from '../user/entity/user.repository';
import { User } from '../user/entity/user.entity';
import { ResponseDeleteLikesDto } from './dto/response-like-dto';

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
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * postId와 userId를 이용한 게시글 검증로직 (userId는 옵션)
   * userId가 들어올경우 게시글 작성자 여부 검증 추가
   */
  private async postValidation(
    postId: number,
    userId?: number,
  ): Promise<Posts> {
    const post = await this.postRepository.findOneBy({
      id: postId,
    });

    // 게시글이 존재하지 않거나, 공개 상태가 아닌경우
    if (!post || post.isPublished === false) {
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 게시글을 작성한 유저가 아닐 경우
    if (userId && post.userId !== userId) {
      throw new HttpException(
        '게시글에 대한 권한이 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return post;
  }

  /**
   * 게시글 리스트 반환
   */
  async getPosts(
    GetPostListsDto: RequestGetPostsQueryDto,
  ): Promise<ResponsePostPageNationDto> {
    const [postList, number] = await this.postRepository.getPostLists(
      GetPostListsDto,
    );

    // 반환값 형식에 맞게 변환
    const post = ResponsePostDto.fromEntities(postList);
    const responsePosts: ResponsePostPageNationDto = { post, number };

    return responsePosts;
  }

  /**
   * 게시글 상세 정보 반환 (userId와 update는 옵션)
   * userId 입력시 해당 유저의 해당 게시글에 좋아요 유무 표시
   * update 입력시 조회수 증가 x
   */
  async getPostDetail(
    postId: number,
    userId = 0,
    update?: boolean,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);
    const postDetail = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'replies'],
    });

    // 좋아요 여부 확인
    const like = await this.likeRepository.findOneBy({ postId, userId });
    // 좋아요 횟수 카운트
    const likeCount = await this.likeRepository.countBy({
      postId,
      isLike: true,
    });
    // 싫어요 횟수 카운트
    const unlikeCount = await this.likeRepository.countBy({
      postId,
      isLike: false,
    });

    // 다음 글 정보
    const nextPost = await this.postRepository.findOne({
      where: { id: MoreThan(postId) },
    });

    // 이전 글 정보
    const prevPost = await this.postRepository.findOne({
      where: { id: LessThan(postId) },
      order: { id: 'DESC' },
    });

    const post = ResponsePostDetailDto.fromEntity(
      postDetail,
      like,
      likeCount,
      unlikeCount,
      prevPost ? prevPost.id : null,
      nextPost ? nextPost.id : null,
    );
    if (update) return post;

    // 조회수 증가
    this.postRepository.update(postId, { hits: () => 'hits + 1' });

    return ResponsePostDetailDto.hitsPlus(post);
  }

  /**
   * 게시글 생성
   */
  async createPost(
    createPostDto: RequestCreatePostDto,
    userId: number,
  ): Promise<ResponseCreatePostDto> {
    const post = this.postRepository.create({ ...createPostDto, userId });

    const savedPost = await this.postRepository.save(post);

    return { postId: savedPost.id };
  }

  /**
   * 게시글 수정
   */
  async updatePost(
    postId: number,
    userId: number,
    updatePostDto: RequestUpdatePostDto,
  ): Promise<ResponseCreatePostDto> {
    await this.postValidation(postId, userId);

    // 게시글 수정
    await this.postRepository.update(postId, updatePostDto);

    return { postId: postId };
  }

  /**
   * 게시글 삭제
   */
  async removePost(
    { postId }: RequestDeletePostDto,
    userId: number,
  ): Promise<boolean> {
    const posts = await this.postRepository.find({
      where: { id: In(postId), userId, isPublished: true },
    });

    // 입력된 게시글의 권한이 없는 게시글이 있을 경우
    if (posts.length !== postId.length) {
      throw new HttpException(
        '삭제 요청된 게시글 중 권한이 없는 게시글이 존재합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 게시글 비활성화 처리
    for await (const post of posts) {
      await this.postRepository.update(post.id, { isPublished: false });
    }

    return true;
  }

  /**
   * 유저가 작성한 게시글 리스트
   */
  async getUserPosts(
    userId: number,
    query: PageNationDto,
  ): Promise<ResponsePostPageNationDto> {
    await this.userValidation(userId);

    const [posts, number] = await this.postRepository.getUserPosts(
      userId,
      query.page,
      query.number,
    );

    const postDto = ResponsePostDto.fromEntities(posts);
    return { post: postDto, number } as ResponsePostPageNationDto;
  }

  /**
   * 댓글 리스트 반환
   */
  async getReplies(postId: number): Promise<ResponseReplyDto[]> {
    await this.postValidation(postId);

    const replies = await this.replyRepository.getReplyLists(postId);

    return ResponseReplyDto.fromEntities(replies);
  }

  /**
   * 댓글 생성 후 게시글에 해당하는 댓글 리스트 반환
   */
  async createReply(
    createReplyDto: RequestCreateReplyDto,
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
   * replyId와 userId를 이용한 댓글 검증 로직 (userId는 옵션)
   * userId 입력시 해당 유저가 작성한 댓글인지 검증
   */
  private async replyValidation(
    replyId: number,
    userId: number,
  ): Promise<Reply> {
    const reply = await this.replyRepository.findOneBy({ id: replyId });

    // 댓글이 존재하지 않거나, soft delete 상태일 경우
    if (!reply || reply.deleted_at)
      throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    // 해당 댓글을 작성한 유저가 아닐 경우,
    if (reply.userId !== userId) {
      throw new HttpException(
        '댓글에 대한 권한이 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return reply;
  }

  /**
   * 댓글 수정
   */
  async updateReply(
    replyId: number,
    userId: number,
    updateReplyDto: RequestUpdateReplyDto,
  ): Promise<boolean> {
    await this.replyValidation(replyId, userId);

    const result = await this.replyRepository.update(replyId, updateReplyDto);

    return result.affected === 1 ? true : false;
  }

  /**
   * 댓글 삭제
   */
  async removeReply(
    { replyId }: RequestDeleteReplyDto,
    userId: number,
  ): Promise<boolean> {
    const replies = await this.replyRepository.find({
      where: { id: In(replyId), userId },
    });

    // 입력된 댓글의 권한이 없는 댓글이 있을 경우
    if (replies.length !== replyId.length) {
      throw new HttpException(
        '삭제 요청된 댓글 중 권한이 없는 댓글이 존재합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const removedReply = await this.replyRepository.softDelete(replyId);

    return removedReply.affected === replyId.length ? true : false;
  }

  /**
   * 좋아요 / 싫어요 생성, 게시글 상세 정보 반환
   */
  async createLike(
    userId: number,
    postId: number,
    { isLike }: RequestCreateLikeDto,
  ): Promise<ResponsePostDetailDto> {
    await this.postValidation(postId);

    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    // 좋아요 / 싫어요를 같은 상태로 요청할 경우
    if (like?.isLike === isLike) {
      throw new HttpException(
        '이전과 같은 상태의 좋아요/싫어요 요청입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 좋아요 이력이 있을경우 업데이트
    if (like) {
      await this.likeRepository.save({ id: like.id, isLike });
      // 이력이 없을 경우 생성
    } else {
      await this.likeRepository.save({ userId, postId, isLike });
    }

    // 게시글 정보 반환
    return this.getPostDetail(postId, userId, true);
  }

  /**
   * 좋아요 / 싫어요 다중 삭제
   */
  async deleteLikeByPosts(
    userId: number,
    { postId }: RequestDeleteLikeDto,
  ): Promise<ResponseDeleteLikesDto> {
    const likes = await this.likeRepository.find({
      where: { userId, postId: In(postId) },
    });

    // 좋아요 / 싫어요 이력이 없을 경우
    if (likes.length !== postId.length) {
      throw new HttpException(
        '좋아요/싫어요를 하지 않은 게시글이 포함되어 있습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.likeRepository.remove(likes);

    return { postId };
  }

  /**
   * 좋아요 / 싫어요 삭제, 게시글 상세 정보 반환
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
      throw new HttpException(
        '좋아요/싫어요 한 이력이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.likeRepository.delete(like);

    // 게시글 정보 반환
    return this.getPostDetail(postId, userId, true);
  }

  /**
   * 유저가 작성한 댓글 조회
   */
  async getUserReplies(
    userId: number,
    query: PageNationDto,
  ): Promise<ResponseReplyByUserPageNationDto> {
    await this.userValidation(userId);

    const [replies, number] = await this.replyRepository.getReplyByUser(
      userId,
      query.page,
      query.number,
    );

    // 댓글 리스트 반환
    const replyDto = ResponseReplyByUserDto.fromEntities(replies);
    return { replies: replyDto, number } as ResponseReplyByUserPageNationDto;
  }

  /**
   * 유저가 작성한 댓글의 게시글 조회
   */
  async getUserReplyPosts(
    userId: number,
    query: PageNationDto,
  ): Promise<ResponsePostPageNationDto> {
    await this.userValidation(userId);

    const [posts, number] = await this.postRepository.getUserReplyByPosts(
      userId,
      query.page,
      query.number,
    );

    const postDto = ResponsePostDto.fromEntities(posts);
    return { post: postDto, number };
  }

  /**
   * 유저가 좋아요한 게시글 조회
   */
  async getUserLikes(
    userId: number,
    query: PageNationDto,
  ): Promise<ResponsePostPageNationDto> {
    await this.userValidation(userId);

    const [posts, number] = await this.postRepository.getLikePosts(
      userId,
      query.page,
      query.number,
    );

    const postDto = ResponsePostDto.fromEntities(posts);
    return { post: postDto, number };
  }

  async userValidation(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('유저를 찾을 수 않습니다.', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}

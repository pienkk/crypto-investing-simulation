import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { In, Repository } from 'typeorm';
import { CommunityService } from './community.service';
import {
  PageNationDto,
  RequestGetPostsQueryDto,
} from './dto/request-query.dto';
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
  ResponsePostDetailDto,
  ResponsePostDto,
} from './dto/response-post.dto';
import { ResponseReplyDto } from './dto/response-reply.dto';
import { LikeEntity } from './entity/like.entity';
import { PostEntity } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { ReplyEntity } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';
import { UserRepository } from 'src/user/entity/user.repository';
import {
  RequestCreateLikeDto,
  RequestDeleteLikeDto,
} from './dto/request-like.dto';

describe('CommunityService', () => {
  let communityService: CommunityService;
  let postRepository: PostRepository;
  let replyRepository: ReplyRepository;
  let likesRepository: Repository<LikeEntity>;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        PostRepository,
        ReplyRepository,
        UserRepository,
        { provide: getRepositoryToken(LikeEntity), useClass: Repository },
      ],
    }).compile();

    communityService = module.get<CommunityService>(CommunityService);
    postRepository = module.get<PostRepository>(PostRepository);
    replyRepository = module.get<ReplyRepository>(ReplyRepository);
    likesRepository = module.get<Repository<LikeEntity>>(
      getRepositoryToken(LikeEntity),
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('getPosts 게시글 리스트 조회', () => {
    const fetchQueryDto: RequestGetPostsQueryDto = { page: 1, categoryId: 1 };
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: PostEntity[] = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
    ];
    const responsePosts: ResponsePostDto[] = [
      {
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
        isPublished: true,
        user: existingUser,
      },
      {
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
        isPublished: true,
        user: existingUser,
      },
    ];

    // 성공
    it('페이지와 일치하는 게시글 리스트를 조회한다.', async () => {
      const postRepositoryGetPostListsSpy = jest
        .spyOn(postRepository, 'getPostLists')
        .mockResolvedValue([existingPosts, existingPosts.length]);

      const result = await communityService.getPosts(fetchQueryDto);

      expect(postRepositoryGetPostListsSpy).toHaveBeenCalledWith(fetchQueryDto);
      expect(result).toEqual({ post: responsePosts, number: 2 });
    });
  });

  describe('getPostDetail 게시글 상세조회', () => {
    const postId = 1;
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: PostEntity[] = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        user: existingUser,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        user: existingUser,
      }),
    ];
    const existingRelationsPost: PostEntity = PostEntity.of({
      ...existingPosts[0],
      user: existingUser,
      replies: [],
    });
    const responsePost: ResponsePostDetailDto = {
      ...existingPosts[0],
      user: existingUser,
      repliesCount: 0,
      isLike: null,
      likeCount: 0,
      unLikeCount: 0,
      prevPostId: null,
      nextPostId: null,
    };

    // 성공
    it('게시글 조회 시 조회수를 1증가 시키고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPosts[0]);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(existingRelationsPost);
      const likeRepositoryFindOneBySpy = jest
        .spyOn(likesRepository, 'findOneBy')
        .mockResolvedValue(null);
      const likeRepositoryCountBySpyOne = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValue(0);
      const postRepositoryFindOneSpyTwo = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(null);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockImplementation();

      const result = await communityService.getPostDetail(postId);

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositoryFindOneSpy).toBeCalledTimes(3);
      expect(likeRepositoryFindOneBySpy).toHaveBeenCalledWith({
        postId,
        userId: 0,
      });
      expect(likeRepositoryCountBySpyOne).toBeCalledTimes(2);
      expect(postRepositoryUpdateSpy).toBeCalledTimes(1);
      expect(result).toEqual({ ...responsePost, hits: 23 });
    });

    // 성공
    it('게시글 상태 변경시 조회수를 증가시키지 않고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPosts[0]);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(existingRelationsPost);
      const postRepositoryFindOneSpySecond = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(existingPosts[1]);
      const postRepositoryFindOneSpyThird = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(null);
      const likeRepositoryFindOneBySpy = jest
        .spyOn(likesRepository, 'findOneBy')
        .mockResolvedValue(null);
      const likeRepositoryCountBySpyOne = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValue(0);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockImplementation();

      const result = await communityService.getPostDetail(postId, 0, true);

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(likeRepositoryFindOneBySpy).toHaveBeenCalledWith({
        postId,
        userId: 0,
      });
      expect(result).toEqual({ ...responsePost, nextPostId: 2 });
    });
  });

  describe('createPost 게시글 생성', () => {
    const userId = 1;
    const RequestCreatePostDto: RequestCreatePostDto = {
      title: '작성 글',
      description: '첫번째 내용',
      categoryId: 1,
    };
    const createPost = PostEntity.of({ ...RequestCreatePostDto, userId });
    const savedPost = PostEntity.of({
      ...createPost,
      id: 1,
      hits: 0,
      created_at: new Date('2023-02-02'),
      isPublished: true,
    });

    // 성공
    it('게시글을 만들고 게시글 id를 받는다.', async () => {
      const postRepositoryCreateSpy = jest
        .spyOn(postRepository, 'create')
        .mockReturnValue(createPost);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(savedPost);

      const result = await communityService.createPost(
        RequestCreatePostDto,
        userId,
      );

      expect(postRepositoryCreateSpy).toHaveBeenCalledWith({
        ...RequestCreatePostDto,
        userId,
      });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(createPost);
      expect(result).toEqual({ postId: savedPost.id });
    });
  });

  describe('updatePost 게시글 수정', () => {
    const postId = 1;
    const userId = 1;
    const requestUpdatePostDto: RequestUpdatePostDto = {
      title: '수정한 제목',
      description: '수정한 내용',
      categoryId: 1,
    };
    const existingPost = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 22,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
      isPublished: true,
      userId: 1,
    });

    it('게시글을 수정하고 게시글 id를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockResolvedValue({ raw: 0, affected: 1, generatedMaps: null });

      const result = await communityService.updatePost(
        postId,
        userId,
        requestUpdatePostDto,
      );

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositoryUpdateSpy).toHaveBeenCalledWith(
        postId,
        requestUpdatePostDto,
      );
      expect(result).toEqual({ postId: postId });
    });

    // 실패
    it('게시글을 작성한 유저가 아니면 게시글을 수정할 수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue({ ...existingPost, userId: 2 });

      const result = async () => {
        return await communityService.updatePost(
          postId,
          userId,
          requestUpdatePostDto,
        );
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '게시글에 대한 권한이 없습니다.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    // 실패
    it('존재하지 않는 게시글은 수정할 수 없다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.updatePost(
          postId,
          userId,
          requestUpdatePostDto,
        );
      };

      expect(result).rejects.toThrow(
        new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('removePost 게시글 삭제', () => {
    const requestDeletePostDto: RequestDeletePostDto = { postId: [1, 2] };
    const userId = 1;
    const existingPosts = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 3,
        categoryId: 1,
        userId: 1,
        created_at: new Date('2023-02-02'),
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번재 내용',
        hits: 3,
        categoryId: 1,
        userId: 1,
        created_at: new Date('2023-02-02'),
      }),
    ];

    it('게시글 삭제 후 true를 반환한다.', async () => {
      const postRepositoryFindSpy = jest
        .spyOn(postRepository, 'find')
        .mockResolvedValue(existingPosts);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockImplementation();

      const result = await communityService.removePost(
        requestDeletePostDto,
        userId,
      );

      expect(postRepositoryFindSpy).toHaveBeenCalledWith({
        where: {
          id: In(requestDeletePostDto.postId),
          userId,
          isPublished: true,
        },
      });

      expect(result).toBe(true);
    });

    // 실패
    it('권한이 없는 게시글은 삭제할 수 없다.', async () => {
      const postRepositoryFindSpy = jest
        .spyOn(postRepository, 'find')
        .mockResolvedValue([existingPosts[0]]);

      const result = async () => {
        return await communityService.removePost(requestDeletePostDto, userId);
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '삭제 요청된 게시글 중 권한이 없는 게시글이 존재합니다.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getReplies 댓글 리스트 조회', () => {
    const postId = 1;
    const user: UserEntity = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '자기소개',
    });
    const existingPost = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      categoryId: 1,
      userId: 1,
      created_at: new Date('2023-02-02'),
    });

    const existingReplies: ReplyEntity[] = [
      ReplyEntity.of({
        id: 1,
        comment: '첫번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      }),
      ReplyEntity.of({
        id: 2,
        comment: '두번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      }),
    ];
    const responseReplies: ResponseReplyDto[] = [
      {
        id: 1,
        comment: '첫번째 댓글',
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      },
      {
        id: 2,
        comment: '두번째 댓글',
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      },
    ];

    // 성공
    it('게시글 id에 해당하는 댓글을 조회한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryGetReplyListsSpy = jest
        .spyOn(replyRepository, 'getReplyLists')
        .mockResolvedValue(existingReplies);

      const result = await communityService.getReplies(postId);

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(postId);
      expect(result).toEqual(responseReplies);
    });

    // 실패
    it('게시글이 없으면 댓글 조회를 할 수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.getReplies(postId);
      };

      expect(result).rejects.toThrow(
        new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getUserPosts 유저가 작성한 게시글리스트 조회', () => {
    const userId = 1;
    const pageNationDto: PageNationDto = { page: 1, number: 10 };
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: PostEntity[] = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
    ];
    const responsePosts: ResponsePostDto[] = [
      {
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
        isPublished: true,
        user: existingUser,
      },
      {
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
        isPublished: true,
        user: existingUser,
      },
    ];

    // 성공
    it('유저가 작성한 게시글을 조회한다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser);
      const postRepositoryGetUserPostsSpy = jest
        .spyOn(postRepository, 'getUserPosts')
        .mockResolvedValue([existingPosts, 2]);

      const result = await communityService.getUserPosts(userId, pageNationDto);

      expect(userRepositoryFindOneBySpy).toHaveBeenCalledWith({
        id: existingUser.id,
      });
      expect(postRepositoryGetUserPostsSpy).toHaveBeenCalledWith(
        userId,
        pageNationDto.page,
        pageNationDto.number,
      );
      expect(result).toEqual({ post: responsePosts, number: 2 });
    });

    // 실패
    it('유저가 없으면 게시글 조회를 할 수 없다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.getUserPosts(userId, pageNationDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('createReply 댓글 작성', () => {
    const userId = 1;
    const user: UserEntity = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '',
    });
    const existingReplies: ReplyEntity[] = [
      ReplyEntity.of({
        id: 1,
        comment: '첫번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      }),
      ReplyEntity.of({
        id: 2,
        comment: '두번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 2,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      }),
    ];
    const existingPost: PostEntity = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 22,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
      isPublished: true,
      replies: [existingReplies[0]],
      userId: 1,
      user: user,
    });
    const createReplyDto: RequestCreateReplyDto = {
      comment: '두번째 댓글',
      postId: 1,
    };
    const createReReplyDto: RequestCreateReplyDto = {
      comment: '두번째 대댓글',
      postId: 1,
      replyId: 1,
    };
    const savedReply = ReplyEntity.of({
      id: 2,
      comment: '두번째 댓글',
      userId: 1,
      postId: 1,
      created_at: new Date('2023-02-02'),
    });

    // 성공
    it('댓글을 추가하고 댓글 리스트를 조회한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositorySaveSpy = jest
        .spyOn(replyRepository, 'save')
        .mockResolvedValueOnce(savedReply);
      const replyRepositoryUpdateSpy = jest
        .spyOn(replyRepository, 'update')
        .mockImplementation();
      const replyRepositoryGetReplyListsSpy = jest
        .spyOn(replyRepository, 'getReplyLists')
        .mockResolvedValue(existingReplies);

      const result = await communityService.createReply(createReplyDto, userId);

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({
        id: createReplyDto.postId,
      });
      expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
        ...createReplyDto,
        userId,
      });
      expect(replyRepositoryUpdateSpy).toHaveBeenCalledWith(2, {
        replyId: 2,
      });
      expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual([
        {
          id: 1,
          comment: '첫번째 댓글',
          replyId: 1,
          created_at: new Date('2023-02-02'),
          deleted_at: null,
          user,
        },
        {
          id: 2,
          comment: '두번째 댓글',
          replyId: 2,
          created_at: new Date('2023-02-02'),
          deleted_at: null,
          user,
        },
      ]);
    });

    // 성공
    it('대댓글을 추가하고 댓글 리스트를 조회한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReplies[0]);
      const replyRepositorySaveSpy = jest
        .spyOn(replyRepository, 'save')
        .mockResolvedValueOnce({ ...savedReply, replyId: 1 });
      const replyRepositoryGetReplyListsSpy = jest
        .spyOn(replyRepository, 'getReplyLists')
        .mockResolvedValue([
          existingReplies[0],
          { ...existingReplies[1], replyId: 1, comment: '두번째 대댓글' },
        ]);

      const result = await communityService.createReply(
        createReReplyDto,
        userId,
      );

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({
        id: createReReplyDto.postId,
      });
      expect(replyRepositoryFindOneBySpy).toHaveBeenCalledWith({
        id: createReReplyDto.replyId,
      });
      expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
        ...createReReplyDto,
        userId: userId,
      });
      expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(
        createReReplyDto.postId,
      );
      expect(result).toEqual([
        {
          id: 1,
          comment: '첫번째 댓글',
          replyId: 1,
          created_at: new Date('2023-02-02'),
          deleted_at: null,
          user,
        },
        {
          id: 2,
          comment: '두번째 대댓글',
          replyId: 1,
          created_at: new Date('2023-02-02'),
          deleted_at: null,
          user,
        },
      ]);
    });

    // 실패
    it('부모 댓글이 없으면 대댓글을 달수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.createReply(createReReplyDto, userId);
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '부모 댓글이 존재하지 않습니다.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    // 실패
    it('게시글이 없으면 댓글을 달수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.createReply(createReplyDto, userId);
      };

      expect(result).rejects.toThrow(
        new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateReply 댓글 수정', () => {
    const replyId = 1;
    const userId = 1;
    const updateReplyDto: RequestUpdateReplyDto = {
      comment: '수정된 댓글',
    };
    const existingReply: ReplyEntity = ReplyEntity.of({
      id: 1,
      comment: '첫번째 댓글',
      userId: 1,
      postId: 1,
      replyId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });

    // 성공
    it('댓글을 수정한다.', async () => {
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReply);
      const replyRepositoryUpdateSpy = jest
        .spyOn(replyRepository, 'update')
        .mockResolvedValue({ raw: 0, affected: 1, generatedMaps: null });

      const result = await communityService.updateReply(
        replyId,
        userId,
        updateReplyDto,
      );

      expect(replyRepositoryFindOneBySpy).toHaveBeenCalledWith({
        id: replyId,
      });
      expect(replyRepositoryUpdateSpy).toHaveBeenCalledWith(replyId, {
        comment: updateReplyDto.comment,
      });
      expect(result).toBe(true);
    });

    // 실패
    it('존재하지 않는 댓글은 수정할 수 없다.', async () => {
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.updateReply(
          replyId,
          userId,
          updateReplyDto,
        );
      };
      expect(result).rejects.toThrow(
        new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });

    // 실패
    it('댓글을 수정할 권한이 없으면 댓글을 수정할 수 없다.', async () => {
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReply);

      const result = async () => {
        return await communityService.updateReply(replyId, 2, updateReplyDto);
      };
      expect(result).rejects.toThrow(
        new HttpException(
          '댓글에 대한 권한이 없습니다.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    // 실패
    it('댓글 수정된 갯수가 1개가 아닐경우 false값을 받는다.', async () => {
      const replyRepositoryFindOneBySpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReply);
      const replyRepositoryUpdateSpy = jest
        .spyOn(replyRepository, 'update')
        .mockResolvedValue({ raw: 0, affected: 0, generatedMaps: null });

      const result = await communityService.updateReply(
        replyId,
        userId,
        updateReplyDto,
      );

      expect(result).toBe(false);
    });
  });

  describe('removeReply 댓글 삭제', () => {
    const replyId: RequestDeleteReplyDto = { replyId: [1, 2] };
    const userId = 1;
    const existingReplies: ReplyEntity[] = [
      ReplyEntity.of({
        id: 1,
        comment: '첫번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
      }),
      ReplyEntity.of({
        id: 2,
        comment: '두번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 2,
        created_at: new Date('2023-02-02'),
      }),
    ];

    // 성공
    it('댓글 삭제 성공 시 status:true 값을 반환한다.', async () => {
      const replyRepositoryFindSpy = jest
        .spyOn(replyRepository, 'find')
        .mockResolvedValue(existingReplies);
      const replyRepositorySoftDeleteSpy = jest
        .spyOn(replyRepository, 'softDelete')
        .mockResolvedValue({ raw: 0, affected: 2, generatedMaps: null });

      const result = await communityService.removeReply(replyId, userId);

      expect(replyRepositorySoftDeleteSpy).toHaveBeenCalledWith([1, 2]);
      expect(result).toBe(true);
    });

    // 실패
    it('권한이 없는 댓글은 삭제할 수 없다..', async () => {
      const replyRepositoryFindSpy = jest
        .spyOn(replyRepository, 'find')
        .mockResolvedValue([existingReplies[0]]);

      const result = async () => {
        return await communityService.removeReply(replyId, userId);
      };
      expect(result).rejects.toThrow(
        new HttpException(
          '삭제 요청된 댓글 중 권한이 없는 댓글이 존재합니다.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('createLike 좋아요/싫어요 생성', () => {
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPost: PostEntity = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 22,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
      isPublished: true,
      replies: [],
      userId: 1,
    });
    const existingLike: LikeEntity = LikeEntity.of({
      postId: 1,
      userId: 1,
      isLike: true,
    });
    const requestCreateLikeDto: RequestCreateLikeDto = {
      isLike: true,
    };
    const existingRelationsPost: PostEntity = PostEntity.of({
      ...existingPost,
      user: existingUser,
      replies: [],
    });

    // 성공
    it('좋아요를 생성하고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const likeRepositoryFindOneSpy = jest
        .spyOn(likesRepository, 'findOne')
        .mockResolvedValue(null);
      const likeRepositorySaveSpy = jest
        .spyOn(likesRepository, 'save')
        .mockResolvedValue(existingLike);
      const postRepositoryFindOneWithUserSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(existingRelationsPost);
      const likeRepositoryFindOneBySpy = jest
        .spyOn(likesRepository, 'findOneBy')
        .mockResolvedValue(existingLike);
      const likeRepositoryCountBySpyOne = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValueOnce(1);
      const likeRepositoryCountBySpyTwo = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValueOnce(0);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await communityService.createLike(
        1,
        1,
        requestCreateLikeDto,
      );

      expect(result).toEqual({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        repliesCount: 0,
        isLike: true,
        likeCount: 1,
        unLikeCount: 0,
        prevPostId: null,
        nextPostId: null,
        user: {
          id: 1,
          nickname: '피엔',
          description: '안녕하세요',
          profileImage: 'https://www.naver.com',
        },
      });
    });

    // 실패
    it('같은 좋아요 상태를 연속해서 할수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const likeRepositoryFindOneSpy = jest
        .spyOn(likesRepository, 'findOne')
        .mockResolvedValue(existingLike);

      const result = async () => {
        return await communityService.createLike(1, 1, requestCreateLikeDto);
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '이전과 같은 상태의 좋아요/싫어요 요청입니다.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    // 실패
    it('존재하지 않는 게시글에 좋아요/싫어요를 생성할 수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.createLike(1, 1, requestCreateLikeDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteLikeByPosts 좋아요/싫어요 다중 삭제', () => {
    const userId = 1;
    const existingLikes: LikeEntity[] = [
      LikeEntity.of({
        postId: 1,
        userId: 1,
        isLike: true,
      }),
      LikeEntity.of({
        postId: 2,
        userId: 1,
        isLike: true,
      }),
      LikeEntity.of({
        postId: 3,
        userId: 1,
        isLike: true,
      }),
    ];
    const requestDeleteLikeDto: RequestDeleteLikeDto = {
      postId: [1, 2, 3],
    };

    // 성공
    it('리스트로 받은 게시글들의 좋아요/싫어요를 삭제한다.', async () => {
      const likesRepositoryFindSpy = jest
        .spyOn(likesRepository, 'find')
        .mockResolvedValue(existingLikes);
      const likeRepositoryRemoveSpy = jest
        .spyOn(likesRepository, 'remove')
        .mockImplementation();

      const result = await communityService.deleteLikeByPosts(
        userId,
        requestDeleteLikeDto,
      );

      expect(result).toEqual({ postId: [1, 2, 3] });
    });

    // 실패
    it('좋아요/ 싫어요를 하지 않은 게시글은 좋아요/싫어요를 삭제할 수 없다.', async () => {
      const likesRepositoryFindSpy = jest
        .spyOn(likesRepository, 'find')
        .mockResolvedValue([existingLikes[0]]);

      const result = async () => {
        return await communityService.deleteLikeByPosts(
          userId,
          requestDeleteLikeDto,
        );
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '좋아요/싫어요를 하지 않은 게시글이 포함되어 있습니다.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('deleteLike 좋아요 삭제', () => {
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPost: PostEntity = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 22,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
      isPublished: true,
      replies: [],
      userId: 1,
    });
    const existingLike: LikeEntity = LikeEntity.of({
      postId: 1,
      userId: 1,
      isLike: true,
    });
    const existingRelationsPost: PostEntity = PostEntity.of({
      ...existingPost,
      user: existingUser,
      replies: [],
    });

    // 성공
    it('좋아요를 삭제하고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const likeRepositoryFindOneSpy = jest
        .spyOn(likesRepository, 'findOne')
        .mockResolvedValue(existingLike);
      const likeRepositorySaveSpy = jest
        .spyOn(likesRepository, 'delete')
        .mockImplementation();
      const postRepositoryFindOneWithUserSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValueOnce(existingRelationsPost);
      const likeRepositoryFindOneBySpy = jest
        .spyOn(likesRepository, 'findOneBy')
        .mockResolvedValue(existingLike);
      const likeRepositoryCountBySpyOne = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValueOnce(1);
      const likeRepositoryCountBySpyTwo = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValueOnce(0);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await communityService.deleteLike(1, 1);

      expect(result).toEqual({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        repliesCount: 0,
        isLike: true,
        likeCount: 1,
        unLikeCount: 0,
        prevPostId: null,
        nextPostId: null,
        user: {
          id: 1,
          nickname: '피엔',
          description: '안녕하세요',
          profileImage: 'https://www.naver.com',
        },
      });
    });

    // 실패
    it('좋아요를 하지 않은 게시글은 좋아요를 삭제할 수 없다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const likeRepositoryFindOneSpy = jest
        .spyOn(likesRepository, 'findOne')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.deleteLike(1, 1);
      };

      expect(result).rejects.toThrow(
        new HttpException(
          '좋아요/싫어요 한 이력이 없습니다.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('getUserReplies 유저가 작성한 댓글 조회', () => {
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPost: PostEntity = PostEntity.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 22,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
      isPublished: true,
      userId: 1,
    });
    const existingReplies: ReplyEntity[] = [
      ReplyEntity.of({
        id: 1,
        comment: '첫번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user: existingUser,
        post: existingPost,
      }),
      ReplyEntity.of({
        id: 2,
        comment: '두번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user: existingUser,
        post: existingPost,
      }),
    ];
    const requestPageNationDto: PageNationDto = {
      page: 1,
      number: 10,
    };

    // 성공
    it('유저가 작성한 댓글을 반환한다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser);
      const replyRepositoryGetReplyByUserSpy = jest
        .spyOn(replyRepository, 'getReplyByUser')
        .mockResolvedValue([existingReplies, 2]);

      const result = await communityService.getUserReplies(
        1,
        requestPageNationDto,
      );

      expect(result).toEqual({
        replies: [
          {
            id: 1,
            comment: '첫번째 댓글',
            replyId: 1,
            created_at: new Date('2023-02-02'),
            deleted_at: null,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
            post: {
              id: 1,
              title: '첫번째 게시글',
              description: '첫번째 내용',
              isPublished: true,
              hits: 22,
              categoryId: 1,
              created_at: new Date('2023-02-01'),
            },
          },
          {
            id: 2,
            comment: '두번째 댓글',
            replyId: 1,
            created_at: new Date('2023-02-02'),
            deleted_at: null,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
            post: {
              id: 1,
              title: '첫번째 게시글',
              description: '첫번째 내용',
              isPublished: true,
              hits: 22,
              categoryId: 1,
              created_at: new Date('2023-02-01'),
            },
          },
        ],
        number: 2,
      });
    });

    // 실패
    it('존재하지 않는 유저의 댓글을 조회할 수 없다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.getUserReplies(1, requestPageNationDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getUserReplyPosts 유저가 작성한 댓글의 게시글 리스트 조회', () => {
    const userId = 1;
    const requestPageNationDto: PageNationDto = {
      page: 1,
      number: 10,
    };
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: PostEntity[] = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
    ];

    // 성공
    it('유저가 작성한 댓글의 게시글 리스트를 반환한다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser);
      const postRepositoryGetUserReplyByPostSpy = jest
        .spyOn(postRepository, 'getUserReplyByPosts')
        .mockResolvedValue([existingPosts, 2]);

      const result = await communityService.getUserReplyPosts(
        userId,
        requestPageNationDto,
      );

      expect(result).toEqual({
        post: [
          {
            id: 1,
            title: '첫번째 게시글',
            description: '첫번째 내용',
            isPublished: true,
            hits: 22,
            categoryId: 1,
            created_at: new Date('2023-02-01'),
            repliesCount: 0,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
          },
          {
            id: 2,
            title: '두번째 게시글',
            description: '두번째 내용',
            isPublished: true,
            hits: 22,
            categoryId: 1,
            created_at: new Date('2023-02-01'),
            repliesCount: 0,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
          },
        ],
        number: 2,
      });
    });

    // 실패
    it('존재하지 않는 유저의 댓글의 게시글 리스트를 조회할 수 없다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.getUserReplyPosts(
          userId,
          requestPageNationDto,
        );
      };

      expect(result).rejects.toThrow(
        new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getUserLikes 유저가 좋아요한 게시글 리스트 조회', () => {
    const userId = 1;
    const requestPageNationDto: PageNationDto = {
      page: 1,
      number: 10,
    };
    const existingUser = UserEntity.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: PostEntity[] = [
      PostEntity.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        replies: [],
        user: existingUser,
      }),
    ];

    // 성공
    it('유저가 좋아요한 게시글 리스트를 반환한다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser);
      const postRepositoryGetUserLikesSpy = jest
        .spyOn(postRepository, 'getLikePosts')
        .mockResolvedValue([existingPosts, 2]);

      const result = await communityService.getUserLikes(
        userId,
        requestPageNationDto,
      );

      expect(result).toEqual({
        post: [
          {
            id: 1,
            title: '첫번째 게시글',
            description: '첫번째 내용',
            isPublished: true,
            hits: 22,
            categoryId: 1,
            created_at: new Date('2023-02-01'),
            repliesCount: 0,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
          },
          {
            id: 2,
            title: '두번째 게시글',
            description: '두번째 내용',
            isPublished: true,
            hits: 22,
            categoryId: 1,
            created_at: new Date('2023-02-01'),
            repliesCount: 0,
            user: {
              id: 1,
              nickname: '피엔',
              description: '안녕하세요',
              profileImage: 'https://www.naver.com',
            },
          },
        ],
        number: 2,
      });
    });

    // 실패
    it('존재하지 않는 유저의 좋아요한 게시글 리스트를 조회할 수 없다.', async () => {
      const userRepositoryFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      const result = async () => {
        return await communityService.getUserLikes(
          userId,
          requestPageNationDto,
        );
      };

      expect(result).rejects.toThrow(
        new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND),
      );
    });
  });
});

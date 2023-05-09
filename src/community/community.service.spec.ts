import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
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
import { Likes } from './entity/like.entity';
import { Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { Reply } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';
import { UserRepository } from 'src/user/entity/user.repository';

describe('CommunityService', () => {
  let communityService: CommunityService;
  let postRepository: PostRepository;
  let replyRepository: ReplyRepository;
  let likesRepository: Repository<Likes>;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        PostRepository,
        ReplyRepository,
        UserRepository,
        { provide: getRepositoryToken(Likes), useClass: Repository },
      ],
    }).compile();

    communityService = module.get<CommunityService>(CommunityService);
    postRepository = module.get<PostRepository>(PostRepository);
    replyRepository = module.get<ReplyRepository>(ReplyRepository);
    likesRepository = module.get<Repository<Likes>>(getRepositoryToken(Likes));
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('getPosts 게시글 리스트 조회', () => {
    const fetchQueryDto: RequestGetPostsQueryDto = { page: 1, categoryId: 1 };
    const existingUser = User.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: Posts[] = [
      Posts.of({
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
      Posts.of({
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
    const existingUser = User.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: Posts[] = [
      Posts.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        isPublished: true,
        user: existingUser,
      }),
      Posts.of({
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
    const existingRelationsPost: Posts = Posts.of({
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

  describe('createPost', () => {
    const userId = 1;
    const RequestCreatePostDto: RequestCreatePostDto = {
      title: '작성 글',
      description: '첫번째 내용',
      categoryId: 1,
    };
    const createPost = Posts.of({ ...RequestCreatePostDto, userId });
    const savedPost = Posts.of({
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
    const existingPost = Posts.of({
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
      Posts.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 3,
        categoryId: 1,
        userId: 1,
        created_at: new Date('2023-02-02'),
      }),
      Posts.of({
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
    const user: User = User.of({
      id: 1,
      nickname: '피엔',
      description: '자기소개',
    });
    const existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      categoryId: 1,
      userId: 1,
      created_at: new Date('2023-02-02'),
    });

    const existingReplies: Reply[] = [
      Reply.of({
        id: 1,
        comment: '첫번째 댓글',
        userId: 1,
        postId: 1,
        replyId: 1,
        created_at: new Date('2023-02-02'),
        deleted_at: null,
        user,
      }),
      Reply.of({
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
    const existingUser = User.of({
      id: 1,
      nickname: '피엔',
      description: '안녕하세요',
      profileImage: 'https://www.naver.com',
    });
    const existingPosts: Posts[] = [
      Posts.of({
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
      Posts.of({
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

  //   describe('createReply', () => {
  //     const userId = 1;
  //     const user: User = User.of({
  //       id: 1,
  //       nickname: '피엔',
  //       description: '',
  //     });
  //     const createReplyDto: RequestCreateReplyDto = {
  //       comment: '두번째 댓글',
  //       postId: 1,
  //     };
  //     const createReReplyDto: RequestCreateReplyDto = {
  //       ...createReplyDto,
  //       replyId: 1,
  //     };
  //     const createdReply = Reply.of({ ...createReplyDto, userId });
  //     const savedReply = Reply.of({
  //       ...createdReply,
  //       id: 2,
  //       created_at: new Date('2023-02-02'),
  //     });
  //     const existingReplies: Reply[] = [
  //       Reply.of({
  //         id: 1,
  //         comment: '첫번째 댓글',
  //         userId: 1,
  //         postId: 1,
  //         replyId: 1,
  //         created_at: new Date('2023-02-02'),
  //         deleted_at: null,
  //         user,
  //       }),
  //       Reply.of({
  //         id: 2,
  //         comment: '두번째 댓글',
  //         userId: 1,
  //         postId: 1,
  //         replyId: 2,
  //         created_at: new Date('2023-02-02'),
  //         deleted_at: null,
  //         user,
  //       }),
  //     ];
  //     const responseReplies: ResponseReplyDto[] = [
  //       {
  //         id: 1,
  //         comment: '첫번째 댓글',
  //         replyId: 1,
  //         created_at: new Date('2023-02-02'),
  //         deleted_at: null,
  //         user,
  //       },
  //       {
  //         id: 2,
  //         comment: '두번째 댓글',
  //         replyId: 2,
  //         created_at: new Date('2023-02-02'),
  //         deleted_at: null,
  //         user,
  //       },
  //     ];

  //     it('댓글 생성 성공 시 댓글 리스트를 반환한다.', async () => {
  //       const postRepositoryfindOneBySpy = jest
  //         .spyOn(postRepository, 'findOneBy')
  //         .mockResolvedValue(existingPost);
  //       const replyRepositoryCreateSpy = jest
  //         .spyOn(replyRepository, 'create')
  //         .mockReturnValue(createdReply);
  //       const replyRepositorySaveSpyOne = jest
  //         .spyOn(replyRepository, 'save')
  //         .mockResolvedValueOnce(savedReply);
  //       const replyRepositorySaveSpyTwo = jest
  //         .spyOn(replyRepository, 'save')
  //         .mockResolvedValueOnce({ ...savedReply, replyId: savedReply.id });
  //       const replyRepositoryGetReplyListsSpy = jest
  //         .spyOn(replyRepository, 'getReplyLists')
  //         .mockResolvedValue(existingReplies);

  //       const result = await communityService.createReply(
  //         createReplyDto,
  //         userId,
  //       );

  //       expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({
  //         id: createReplyDto.postId,
  //       });
  //       expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
  //         ...createReplyDto,
  //         userId,
  //       });
  //       expect(replyRepositorySaveSpyOne).toHaveBeenCalledWith(createdReply);
  //       expect(replyRepositorySaveSpyTwo).toHaveBeenCalledWith({
  //         ...savedReply,
  //         replyId: savedReply.id,
  //       });
  //       expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(
  //         createReplyDto.postId,
  //       );
  //       expect(result).toEqual(responseReplies);
  //     });

  //     it('대 댓글 생성 성공 시 댓글 리스트를 반환한다.', async () => {
  //       const postRepositoryfindOneBySpy = jest
  //         .spyOn(postRepository, 'findOneBy')
  //         .mockResolvedValue(existingPost);
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(existingReply);
  //       const replyRepositoryCreateSpy = jest
  //         .spyOn(replyRepository, 'create')
  //         .mockReturnValue({ ...createdReply, replyId: 1 });
  //       const replyRepositorySaveSpy = jest
  //         .spyOn(replyRepository, 'save')
  //         .mockResolvedValueOnce({ ...savedReply, replyId: 1 });
  //       const replyRepositoryGetReplyListsSpy = jest
  //         .spyOn(replyRepository, 'getReplyLists')
  //         .mockResolvedValue([
  //           existingReplies[0],
  //           { ...existingReplies[1], replyId: 1 },
  //         ]);

  //       const result = await communityService.createReply(
  //         createReReplyDto,
  //         userId,
  //       );

  //       expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({
  //         id: createReReplyDto.postId,
  //       });
  //       expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
  //         id: createReReplyDto.replyId,
  //       });
  //       expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
  //         ...createReReplyDto,
  //         userId,
  //       });
  //       expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
  //         ...createdReply,
  //         replyId: createReReplyDto.replyId,
  //       });
  //       expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(
  //         createReReplyDto.postId,
  //       );
  //       expect(result).toEqual([
  //         responseReplies[0],
  //         { ...responseReplies[1], replyId: 1 },
  //       ]);
  //     });

  //     it('대 댓글 작성 시 원본 댓글이 존재하지 않을 경우 댓글이 없다는 예외를 던진다.', async () => {
  //       const postRepositoryfindOneBySpy = jest
  //         .spyOn(postRepository, 'findOneBy')
  //         .mockResolvedValue(existingPost);
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(undefined);

  //       const result = async () => {
  //         return await communityService.createReply(createReReplyDto, userId);
  //       };

  //       expect(result).rejects.toThrow(
  //         new HttpException('Reply is not found', HttpStatus.NOT_FOUND),
  //       );
  //     });
  //   });
  //   describe('updateReply', () => {
  //     const replyId = 1;
  //     const userId = 1;
  //     const updateReplyDto: RequestUpdateReplyDto = {
  //       comment: '수정된 댓글',
  //     };

  //     it('댓글 수정 성공 시 status: true 값을 반환한다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(existingReply);
  //       const replyRepositoryUpdateSpy = jest
  //         .spyOn(replyRepository, 'update')
  //         .mockResolvedValue({ raw: 0, affected: 1, generatedMaps: null });

  //       const result = await communityService.updateReply(
  //         replyId,
  //         userId,
  //         updateReplyDto,
  //       );

  //       expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
  //         id: replyId,
  //       });
  //       expect(replyRepositoryUpdateSpy).toHaveBeenCalledWith(
  //         replyId,
  //         RequestUpdateReplyDto,
  //       );
  //       expect(result).toEqual({ status: true });
  //     });

  //     it('댓글 수정 요청에 대한 댓글이 없는 경우, 댓글이 없다는 예외를 던진다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(undefined);

  //       const result = async () => {
  //         return await communityService.updateReply(
  //           replyId,
  //           userId,
  //           updateReplyDto,
  //         );
  //       };
  //       expect(result).rejects.toThrow(
  //         new HttpException('This reply does not exist', HttpStatus.NOT_FOUND),
  //       );
  //     });

  //     it('댓글 수정 요청에 대한 권한이 없는 경우, 권한이 없다는 예외를 던진다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue({ ...existingReply, userId: 2 });

  //       const result = async () => {
  //         return await communityService.updateReply(
  //           replyId,
  //           userId,
  //           updateReplyDto,
  //         );
  //       };
  //       expect(result).rejects.toThrow(
  //         new HttpException(
  //           "Don't have reply permisson",
  //           HttpStatus.BAD_REQUEST,
  //         ),
  //       );
  //     });

  //     it('댓글 수정이 제대로 이뤄지지 않았을 경우, 잘못된 접근이라는 예외를 던진다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(existingReply);
  //       const replyRepositoryUpdateSpy = jest
  //         .spyOn(replyRepository, 'update')
  //         .mockResolvedValue({ raw: 0, affected: 0, generatedMaps: null });

  //       const result = async () => {
  //         return await communityService.updateReply(
  //           replyId,
  //           userId,
  //           updateReplyDto,
  //         );
  //       };

  //       expect(result).rejects.toThrow(
  //         new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN),
  //       );
  //     });
  //   });
  //   describe('removeReply', () => {
  //     const time = new Date('2023-02-02');
  //     jest.useFakeTimers();
  //     jest.setSystemTime(time);
  //     const replyId: RequestDeleteReplyDto = { replyId: [1] };
  //     const userId = 1;

  //     it('댓글 삭제 성공 시 status:true 값을 반환한다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(existingReply);
  //       const replyRepositorySaveSpy = jest
  //         .spyOn(replyRepository, 'save')
  //         .mockResolvedValue({
  //           ...existingReply,
  //           deleted_at: new Date('2023-02-02'),
  //         });

  //       const result = await communityService.removeReply(replyId, userId);

  //       expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
  //         id: replyId,
  //       });
  //       expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
  //         ...existingReply,
  //         deleted_at: new Date('2023-02-02'),
  //       });
  //       expect(result).toEqual({ status: true });
  //     });

  //     it('댓글 삭제 실패 시 잘못된 접근이라는 예외를 던진다.', async () => {
  //       const replyRepositoryfindOneBySpy = jest
  //         .spyOn(replyRepository, 'findOneBy')
  //         .mockResolvedValue(existingReply);
  //       const replyRepositorySaveSpy = jest
  //         .spyOn(replyRepository, 'save')
  //         .mockResolvedValue({ ...existingReply, deleted_at: null });

  //       const result = async () => {
  //         return await communityService.removeReply(replyId, userId);
  //       };
  //       expect(result).rejects.toThrow(
  //         new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN),
  //       );
  //     });
  //   });
  // });
});

import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { In, Repository } from 'typeorm';
import { CommunityService } from './community.service';
import { RequestGetPostsQueryDto } from './dto/Request-query.dto';
import {
  RequestCreatePostDto,
  RequestUpdatePostDto,
} from './dto/Request-post.dto';
import {
  RequestCreateReplyDto,
  RequestDeleteReplyDto,
  RequestUpdateReplyDto,
} from './dto/Request-reply.dto';
import {
  ResponsePostDetailDto,
  ResponsePostDto,
} from './dto/Response-post.dto';
import { ResponseReplyDto } from './dto/Response-reply.dto';
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
  let existingPost: Posts;
  let existingReply: Reply;

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
  beforeEach(() => {
    existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      categoryId: 1,
      userId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });
    existingReply = Reply.of({
      id: 1,
      comment: '첫번째 댓글',
      userId: 1,
      postId: 1,
      replyId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });
  });

  describe('getPosts', () => {
    const fetchQueryDto: RequestGetPostsQueryDto = { page: 1, categoryId: 1 };
    const user: User = User.of({
      id: 1,
      nickname: '피엔',
      description: '',
    });
    const existingPosts: Posts[] = [
      Posts.of({
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        replies: [],
        user,
      }),
      Posts.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        categoryId: 1,
        created_at: new Date('2023-02-01'),
        replies: [],
        user,
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
        user,
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
        user,
      },
    ];

    it('게시글 목록 조회 시 조건에 맞는 게시글의 페이지네이션과 전체 게시글 갯수를 반환한다.', async () => {
      const postRepositoryGetPostListsSpy = jest
        .spyOn(postRepository, 'getPostLists')
        .mockResolvedValue([existingPosts, existingPosts.length]);

      const result = await communityService.getPosts(fetchQueryDto);

      expect(postRepositoryGetPostListsSpy).toHaveBeenCalledWith(fetchQueryDto);
      expect(result).toEqual({ post: responsePosts, number: 2 });
    });
  });

  describe('getPostDetail', () => {
    const postId = 1;
    const user: User = User.of({
      id: 1,
      nickname: '피엔',
      description: '',
    });
    const existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      categoryId: 1,
      created_at: new Date('2023-02-01'),
    });
    const existingPostRelation = Posts.of({
      ...existingPost,
      user,
      replies: [],
    });
    const responsePost: ResponsePostDetailDto = {
      ...existingPost,
      user,
      repliesCount: 0,
      isLike: null,
      likeCount: 0,
      unLikeCount: 0,
      prevPostId: null,
      nextPostId: null,
    };

    it('게시글 조회 시 조회수를 1증가 시키고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(existingPostRelation);
      const likeRepositoryFindOneBySpy = jest
        .spyOn(likesRepository, 'findOneBy')
        .mockResolvedValue(null);
      const likeRepositoryCountBySpyOne = jest
        .spyOn(likesRepository, 'countBy')
        .mockResolvedValue(0);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockImplementation();

      const result = await communityService.getPostDetail(postId);

      expect(postRepositoryFindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(likeRepositoryFindOneBySpy).toHaveBeenCalledWith({
        postId,
        userId: 0,
      });
      expect(likeRepositoryCountBySpyOne).toBeCalledTimes(2);
      expect(postRepositoryUpdateSpy).toBeCalledTimes(1);
      expect(result).toEqual({ ...responsePost, hits: 4 });
    });

    it('게시글 상태 변경시 조회수를 증가시키지 않고 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(existingPostRelation);
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
      expect(likeRepositoryCountBySpyOne).toBeCalledTimes(2);
      expect(postRepositoryUpdateSpy).toBeCalledTimes(0);
      expect(result).toEqual(responsePost);
    });
  });

  describe('createPost', () => {
    const userId = 1;
    const RequestCreatePostDto: RequestCreatePostDto = {
      title: '첫 글',
      description: '첫번째 내용',
      categoryId: 1,
    };
    const createPost = Posts.of({ ...RequestCreatePostDto, userId });
    const savedPost = Posts.of({
      ...createPost,
      id: 1,
      hits: 0,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });

    it('게시글 생성 성공 시 게시글 정보를 반환한다.', async () => {
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
      expect(result).toEqual(savedPost);
    });
  });

  describe('updatePost', () => {
    const postId = 1;
    const userId = 1;
    const updatePostDto: RequestUpdatePostDto = {
      title: '수정한 제목',
      description: '수정한 내용',
      categoryId: 1,
    };
    it('게시글 수정 성공 시 true값을 반환한다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockResolvedValue({ raw: 0, affected: 1, generatedMaps: null });

      const result = await communityService.updatePost(
        postId,
        userId,
        updatePostDto,
      );

      expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositoryUpdateSpy).toHaveBeenCalledWith(
        postId,
        updatePostDto,
      );
      expect(result).toEqual({ status: true });
    });

    it('게시글 작성자가 일치하지 않을 시 권한이 없다는 예외를 던진다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue({ ...existingPost, userId: 2 });

      const result = async () => {
        return await communityService.updatePost(postId, userId, updatePostDto);
      };

      expect(result).rejects.toThrow(
        new HttpException("Don't have post permisson", HttpStatus.BAD_REQUEST),
      );
    });

    it('게시글 수정 결과가 1건이 아닐 경우 접근 거부 예외를 던진다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockResolvedValue({ raw: 0, affected: 0, generatedMaps: null });

      const result = async () => {
        return await communityService.updatePost(postId, userId, updatePostDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('removePost', () => {
    const time = new Date('2023-02-02');
    jest.useFakeTimers();
    jest.setSystemTime(time);
    const postId = { postId: [1] };
    const userId = 1;
    const existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      categoryId: 1,
      userId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });

    const removedPost = Posts.of({
      ...existingPost,
      deleted_at: new Date('2023-02-02'),
    });

    it('게시글 삭제 성공 시 true 상태 값을 반환한다.', async () => {
      const postRepositoryfindSpy = jest
        .spyOn(postRepository, 'find')
        .mockResolvedValue([existingPost]);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(removedPost);

      const result = await communityService.removePost(postId, userId);

      expect(postRepositoryfindSpy).toHaveBeenCalledWith({
        where: { id: In(postId.postId), userId, isPublished: true },
      });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(removedPost);
      expect(result).toEqual({ status: true });
    });

    it('삭제된 게시글 삭제 요청 시 게시글이 존재하지 않다는 예외를 던진다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(removedPost);

      const result = async () => {
        return await communityService.removePost(postId, userId);
      };

      expect(result).rejects.toThrow(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });

    describe('getReplies', () => {
      const postId = 1;
      const user: User = User.of({
        id: 1,
        nickname: '피엔',
        description: '',
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

      it('게시글에 대한 댓글 요청시 해당 게시글에 대한 댓글리스트를 반환한다.', async () => {
        const postRepositoryfindOneBySpy = jest
          .spyOn(postRepository, 'findOneBy')
          .mockResolvedValue(existingPost);
        const replyRepositoryGetReplyListsSpy = jest
          .spyOn(replyRepository, 'getReplyLists')
          .mockResolvedValue(existingReplies);

        const result = await communityService.getReplies(postId);

        expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({ id: postId });
        expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(postId);
        expect(result).toEqual(responseReplies);
      });

      it('댓글 요청에 대한 게시글이 존재하지 않을 시 게시글이 없다는 예외를 던진다.', async () => {
        const postRepositoryfindOneBySpy = jest
          .spyOn(postRepository, 'findOneBy')
          .mockResolvedValue(undefined);

        const result = async () => {
          return await communityService.getReplies(postId);
        };

        expect(result).rejects.toThrow(
          new HttpException('Post not found', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('createReply', () => {
      const userId = 1;
      const user: User = User.of({
        id: 1,
        nickname: '피엔',
        description: '',
      });
      const createReplyDto: RequestCreateReplyDto = {
        comment: '두번째 댓글',
        postId: 1,
      };
      const createReReplyDto: RequestCreateReplyDto = {
        ...createReplyDto,
        replyId: 1,
      };
      const createdReply = Reply.of({ ...createReplyDto, userId });
      const savedReply = Reply.of({
        ...createdReply,
        id: 2,
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
          replyId: 2,
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
          replyId: 2,
          created_at: new Date('2023-02-02'),
          deleted_at: null,
          user,
        },
      ];

      it('댓글 생성 성공 시 댓글 리스트를 반환한다.', async () => {
        const postRepositoryfindOneBySpy = jest
          .spyOn(postRepository, 'findOneBy')
          .mockResolvedValue(existingPost);
        const replyRepositoryCreateSpy = jest
          .spyOn(replyRepository, 'create')
          .mockReturnValue(createdReply);
        const replyRepositorySaveSpyOne = jest
          .spyOn(replyRepository, 'save')
          .mockResolvedValueOnce(savedReply);
        const replyRepositorySaveSpyTwo = jest
          .spyOn(replyRepository, 'save')
          .mockResolvedValueOnce({ ...savedReply, replyId: savedReply.id });
        const replyRepositoryGetReplyListsSpy = jest
          .spyOn(replyRepository, 'getReplyLists')
          .mockResolvedValue(existingReplies);

        const result = await communityService.createReply(
          createReplyDto,
          userId,
        );

        expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({
          id: createReplyDto.postId,
        });
        expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
          ...createReplyDto,
          userId,
        });
        expect(replyRepositorySaveSpyOne).toHaveBeenCalledWith(createdReply);
        expect(replyRepositorySaveSpyTwo).toHaveBeenCalledWith({
          ...savedReply,
          replyId: savedReply.id,
        });
        expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(
          createReplyDto.postId,
        );
        expect(result).toEqual(responseReplies);
      });

      it('대 댓글 생성 성공 시 댓글 리스트를 반환한다.', async () => {
        const postRepositoryfindOneBySpy = jest
          .spyOn(postRepository, 'findOneBy')
          .mockResolvedValue(existingPost);
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(existingReply);
        const replyRepositoryCreateSpy = jest
          .spyOn(replyRepository, 'create')
          .mockReturnValue({ ...createdReply, replyId: 1 });
        const replyRepositorySaveSpy = jest
          .spyOn(replyRepository, 'save')
          .mockResolvedValueOnce({ ...savedReply, replyId: 1 });
        const replyRepositoryGetReplyListsSpy = jest
          .spyOn(replyRepository, 'getReplyLists')
          .mockResolvedValue([
            existingReplies[0],
            { ...existingReplies[1], replyId: 1 },
          ]);

        const result = await communityService.createReply(
          createReReplyDto,
          userId,
        );

        expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({
          id: createReReplyDto.postId,
        });
        expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
          id: createReReplyDto.replyId,
        });
        expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
          ...createReReplyDto,
          userId,
        });
        expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
          ...createdReply,
          replyId: createReReplyDto.replyId,
        });
        expect(replyRepositoryGetReplyListsSpy).toHaveBeenCalledWith(
          createReReplyDto.postId,
        );
        expect(result).toEqual([
          responseReplies[0],
          { ...responseReplies[1], replyId: 1 },
        ]);
      });

      it('대 댓글 작성 시 원본 댓글이 존재하지 않을 경우 댓글이 없다는 예외를 던진다.', async () => {
        const postRepositoryfindOneBySpy = jest
          .spyOn(postRepository, 'findOneBy')
          .mockResolvedValue(existingPost);
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(undefined);

        const result = async () => {
          return await communityService.createReply(createReReplyDto, userId);
        };

        expect(result).rejects.toThrow(
          new HttpException('Reply is not found', HttpStatus.NOT_FOUND),
        );
      });
    });
    describe('updateReply', () => {
      const replyId = 1;
      const userId = 1;
      const updateReplyDto: RequestUpdateReplyDto = {
        comment: '수정된 댓글',
      };

      it('댓글 수정 성공 시 status: true 값을 반환한다.', async () => {
        const replyRepositoryfindOneBySpy = jest
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

        expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
          id: replyId,
        });
        expect(replyRepositoryUpdateSpy).toHaveBeenCalledWith(
          replyId,
          RequestUpdateReplyDto,
        );
        expect(result).toEqual({ status: true });
      });

      it('댓글 수정 요청에 대한 댓글이 없는 경우, 댓글이 없다는 예외를 던진다.', async () => {
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(undefined);

        const result = async () => {
          return await communityService.updateReply(
            replyId,
            userId,
            updateReplyDto,
          );
        };
        expect(result).rejects.toThrow(
          new HttpException('This reply does not exist', HttpStatus.NOT_FOUND),
        );
      });

      it('댓글 수정 요청에 대한 권한이 없는 경우, 권한이 없다는 예외를 던진다.', async () => {
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue({ ...existingReply, userId: 2 });

        const result = async () => {
          return await communityService.updateReply(
            replyId,
            userId,
            updateReplyDto,
          );
        };
        expect(result).rejects.toThrow(
          new HttpException(
            "Don't have reply permisson",
            HttpStatus.BAD_REQUEST,
          ),
        );
      });

      it('댓글 수정이 제대로 이뤄지지 않았을 경우, 잘못된 접근이라는 예외를 던진다.', async () => {
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(existingReply);
        const replyRepositoryUpdateSpy = jest
          .spyOn(replyRepository, 'update')
          .mockResolvedValue({ raw: 0, affected: 0, generatedMaps: null });

        const result = async () => {
          return await communityService.updateReply(
            replyId,
            userId,
            updateReplyDto,
          );
        };

        expect(result).rejects.toThrow(
          new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN),
        );
      });
    });
    describe('removeReply', () => {
      const time = new Date('2023-02-02');
      jest.useFakeTimers();
      jest.setSystemTime(time);
      const replyId: RequestDeleteReplyDto = { replyId: [1] };
      const userId = 1;

      it('댓글 삭제 성공 시 status:true 값을 반환한다.', async () => {
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(existingReply);
        const replyRepositorySaveSpy = jest
          .spyOn(replyRepository, 'save')
          .mockResolvedValue({
            ...existingReply,
            deleted_at: new Date('2023-02-02'),
          });

        const result = await communityService.removeReply(replyId, userId);

        expect(replyRepositoryfindOneBySpy).toHaveBeenCalledWith({
          id: replyId,
        });
        expect(replyRepositorySaveSpy).toHaveBeenCalledWith({
          ...existingReply,
          deleted_at: new Date('2023-02-02'),
        });
        expect(result).toEqual({ status: true });
      });

      it('댓글 삭제 실패 시 잘못된 접근이라는 예외를 던진다.', async () => {
        const replyRepositoryfindOneBySpy = jest
          .spyOn(replyRepository, 'findOneBy')
          .mockResolvedValue(existingReply);
        const replyRepositorySaveSpy = jest
          .spyOn(replyRepository, 'save')
          .mockResolvedValue({ ...existingReply, deleted_at: null });

        const result = async () => {
          return await communityService.removeReply(replyId, userId);
        };
        expect(result).rejects.toThrow(
          new HttpException('INVALID ACCESS', HttpStatus.FORBIDDEN),
        );
      });
    });
  });
});

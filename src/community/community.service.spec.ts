import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/entity/user.entity';
import { CommunityService } from './community.service';
import { QueryDto } from './dto/community-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponsePostsDto } from './dto/response-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';

describe('CommunityService', () => {
  let communityService: CommunityService;
  let postRepository: PostRepository;
  let replyRepository: ReplyRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityService, PostRepository, ReplyRepository],
    }).compile();

    communityService = module.get<CommunityService>(CommunityService);
    postRepository = module.get<PostRepository>(PostRepository);
    replyRepository = module.get<ReplyRepository>(ReplyRepository);
  });

  describe('getPosts', () => {
    const fetchQueryDto: QueryDto = { page: 1 };
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
        label: '잡담',
        created_at: new Date('2023-02-01'),
        replies: [],
        user,
      }),
      Posts.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        label: '잡담',
        created_at: new Date('2023-02-01'),
        replies: [],
        user,
      }),
    ];
    const responsePosts: ResponsePostsDto[] = [
      {
        id: 1,
        title: '첫번째 게시글',
        description: '첫번째 내용',
        hits: 22,
        label: '잡담',
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
        user,
      },
      {
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        hits: 22,
        label: '잡담',
        created_at: new Date('2023-02-01'),
        repliesCount: 0,
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
      label: '잡담',
      created_at: new Date('2023-02-01'),
    });
    const existingPostDetail = Posts.of({ ...existingPost, replies: [], user });
    const responsePost: ResponsePostsDto = {
      ...existingPost,
      user,
      repliesCount: 0,
    };

    it('게시글 조회 시 조회수를 1증가 시키고 게시글 정보를 반환한다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryGetPostDetailSpy = jest
        .spyOn(postRepository, 'getPostDetail')
        .mockResolvedValue(existingPostDetail);
      const postRepositoryUpdateSpy = jest
        .spyOn(postRepository, 'update')
        .mockImplementation();

      const result = await communityService.getPostDetail(postId);

      expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositoryGetPostDetailSpy).toHaveBeenCalledWith(postId);
      expect(result).toEqual({ ...responsePost, hits: 4 });
    });

    it('존재하지 않는 게시글 조회 시 게시글이 존재하지 않다는 예외를 던진다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        return await communityService.getPostDetail(postId);
      };

      expect(result).rejects.toThrow(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('createPost', () => {
    const userId = 1;
    const createPostDto: CreatePostDto = {
      title: '첫 글',
      description: '첫번째 내용',
      label: '잡담',
    };
    const createPost = Posts.of({ ...createPostDto, userId });
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

      const result = await communityService.createPost(createPostDto, userId);

      expect(postRepositoryCreateSpy).toHaveBeenCalledWith({
        ...createPostDto,
        userId,
      });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(createPost);
      expect(result).toEqual(savedPost);
    });
  });

  describe('updatePost', () => {
    const postId = 1;
    const userId = 1;
    const updatePostDto: UpdatePostDto = {
      title: '수정한 제목',
      description: '수정한 내용',
      label: '잡담',
    };
    const existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      label: '잡담',
      userId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });

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
      expect(result).toBe(true);
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
    const postId = 1;
    const userId = 1;
    const existingPost = Posts.of({
      id: 1,
      title: '첫번째 게시글',
      description: '첫번째 내용',
      hits: 3,
      label: '잡담',
      userId: 1,
      created_at: new Date('2023-02-02'),
      deleted_at: null,
    });
    const removedPost = Posts.of({
      ...existingPost,
      deleted_at: new Date('2023-02-02'),
    });

    it('게시글 삭제 성공 시 true 상태 값을 반환한다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(removedPost);

      const result = await communityService.removePost(postId, userId);

      expect(postRepositoryfindOneBySpy).toHaveBeenCalledWith({ id: postId });
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

    it('게시글 삭제 실패 시 요청이 완료되지 않았다는 예외를 던진다.', async () => {
      const postRepositoryfindOneBySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue({ ...existingPost, deleted_at: null });
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue({ ...removedPost, deleted_at: null });

      const result = async () => {
        return await communityService.removePost(postId, userId);
      };

      expect(result).rejects.toThrow(
        new HttpException('This post does not exist', HttpStatus.NOT_FOUND),
      );
    });
  });
});

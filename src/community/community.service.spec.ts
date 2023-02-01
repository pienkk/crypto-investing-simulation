import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { QueryDto } from './dto/community-query.dto';
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
    const fetchQueryDto: QueryDto = {};
  });
});

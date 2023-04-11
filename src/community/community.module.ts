import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Likes } from './entity/like.entity';
import { PostRepository } from './entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';
import { UserRepository } from '../user/entity/user.repository';
import { CommunityGateway } from './community.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes]),
    TypeOrmExModule.forCustomRepository([
      PostRepository,
      ReplyRepository,
      UserRepository,
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityGateway],
})
export class CommunityModule {}

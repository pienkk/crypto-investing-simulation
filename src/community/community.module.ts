import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { LikeEntity } from './entity/like.entity';
import { PostRepository } from './entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';
import { UserRepository } from '../user/entity/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity]),
    TypeOrmExModule.forCustomRepository([
      PostRepository,
      ReplyRepository,
      UserRepository,
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}

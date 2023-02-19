import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Likes } from './entity/like.entity';
import { PostRepository } from './entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes]),
    TypeOrmExModule.forCustomRepository([PostRepository, ReplyRepository]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}

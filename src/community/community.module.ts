import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/typeorm/typeorm-ex.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { PostRepository } from './entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PostRepository, ReplyRepository]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}

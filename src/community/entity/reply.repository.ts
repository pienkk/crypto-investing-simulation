import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';

@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  async getReplyLists(postId: number): Promise<Reply[]> {
    return await this.createQueryBuilder('reply')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.postId = :postId', { postId })
      .orderBy('reply.replyId', 'ASC')
      .addOrderBy('reply.created_at', 'ASC')
      .getMany();
  }
}

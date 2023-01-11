import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { QueryDto } from '../dto/community-query.dto';
import { Reply } from './reply.entity';

@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  async getReplyLists(
    postId: number,
    { page, number }: QueryDto,
  ): Promise<[Reply[], number]> {
    return await this.createQueryBuilder('reply')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.postId = :postId', { postId })
      .take(number)
      .skip(page - 1)
      .getManyAndCount();
  }
}

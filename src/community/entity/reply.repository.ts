import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { QueryDto } from '../dto/community-query.dto';
import { Reply } from './reply.entity';

@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  async getReplyLists(
    postId: number,
    { page, number }: QueryDto,
  ): Promise<[Reply[], number]> {
    return await this.createQueryBuilder('replies')
      .innerJoinAndSelect('replies.user', 'user')
      .where('replies.postId = :postId', { postId })
      .take(number)
      .skip(page - 1)
      .getManyAndCount();
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { comment, userId, postId } = createReplyDto;
    const reply = this.create({ comment, userId, postId });
    return await this.save(reply);
  }

  async updateReply(id: number, updateReplyDto: CreateReplyDto): Promise<void> {
    await this.update(id, updateReplyDto);
  }

  async removeReply(id: number): Promise<void> {
    await this.delete({ id });
  }

  async getReplyExistByUser(id: number): Promise<Reply> {
    // jwt 추가후 유저 검색 조건 추가
    return await this.findOneBy({ id });
  }
}

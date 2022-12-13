import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { GetPostListsDto } from '../dto/get-post.dto';
import { Reply } from './reply.entity';

@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  async getReplyLists(
    postId: number,
    { page, number }: GetPostListsDto,
  ): Promise<[Reply[], number]> {
    return await this.findAndCount({
      take: number,
      skip: (page - 1) * number,
    });
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    return await this.save(createReplyDto);
  }

  async updateReply(id: number, updateReplyDto: CreateReplyDto): Promise<void> {
    console.log(id, updateReplyDto);
    await this.update(id, updateReplyDto);
  }
}

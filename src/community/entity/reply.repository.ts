import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';

/**
 * 댓글 커스텀 Repository
 */
@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  /**
   * 게시글에 대한 댓글 리스트 반환
   */
  async getReplyLists(postId: number): Promise<Reply[]> {
    return await this.createQueryBuilder('reply')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.postId = :postId', { postId })
      .withDeleted()
      .orderBy('reply.replyId', 'ASC')
      .addOrderBy('reply.created_at', 'ASC')
      .getMany();
  }

  /**
   * 유저가 작성한 댓글 리스트 반환
   */
  async getReplyByUser(
    userId: number,
    page: number,
    number: number,
  ): Promise<[Reply[], number]> {
    return await this.createQueryBuilder('reply')
      .leftJoinAndSelect('reply.post', 'post')
      .leftJoinAndSelect('post.replies', 'replies')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.userId = :userId', { userId })
      .orderBy('reply.replyId', 'DESC')
      .addOrderBy('reply.created_at', 'ASC')
      .take(number)
      .skip((page - 1) * number)
      .getManyAndCount();
  }
}

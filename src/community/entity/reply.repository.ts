import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';

/**
 * 댓글 커스텀 Repository
 */
@CustomRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  /**
   * 게시글 id를 입력받아 해당 게시글에 대한 댓글 리스트를 반환한다.
   * @param postId 게시글 id
   * @returns 댓글 리스트
   */
  async getReplyLists(postId: number): Promise<Reply[]> {
    return await this.createQueryBuilder('reply')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.postId = :postId', { postId })
      .orderBy('reply.replyId', 'ASC')
      .addOrderBy('reply.created_at', 'ASC')
      .getMany();
  }

  /**
   * 유저 id를 입력받아 해당 유저가 작성한 댓글 리스트를 반환한다.
   * @param userId 유저 id
   * @returns 댓글 리스트
   */
  async getReplyByUser(userId: number): Promise<Reply[]> {
    return await this.createQueryBuilder('reply')
      .innerJoinAndSelect('reply.user', 'user')
      .where('reply.userId = :userId', { userId })
      .andWhere('reply.deleted_at is null')
      .orderBy('reply.replyId', 'DESC')
      .addOrderBy('reply.created_at', 'ASC')
      .getMany();
  }
}

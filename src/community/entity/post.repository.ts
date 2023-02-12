import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { QueryDto } from '../dto/community-query.dto';
import { Posts } from './post.entity';

@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  async getPostDetail(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.id = :id', { id: postId })
      .getOne();
  }

  async getPostLists({
    page,
    number,
    content,
    categoryId,
    nickname,
  }: QueryDto): Promise<[Posts[], number]> {
    const qb = this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.deleted_at is null')
      .andWhere('reply.deleted_at is null');

    if (content !== '') {
      qb.orWhere('post.title LIKE :content', { content: `%${content}%` })
        .orWhere('post.description LIKE :content', { content: `%${content}%` })
        .orWhere('reply.comment LIKE :content', { conetent: `%${content}%` });
    }

    if (nickname !== '') {
      qb.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${nickname}%`,
      });
    }
    if (categoryId !== 0) {
      qb.andWhere('post.categoryId = :categoryId ', { categoryId });
    }
    return await qb
      .take(number)
      .skip((page - 1) * number)
      .orderBy('post.created_at', 'DESC')
      .getManyAndCount();
  }

  async getUserPosts(userId: number): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.deleted_at is null')
      .andWhere('reply.deleted_at is null')
      .andWhere('post.userId =:userId', { userId })
      .orderBy('post.created_at', 'DESC')
      .getManyAndCount();
  }
}

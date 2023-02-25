import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Brackets, Repository } from 'typeorm';
import { QueryDto } from '../dto/community-query.dto';
import { Posts } from './post.entity';

/**
 * 게시글 커스텀 Repository
 */
@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  /**
   * 필터링에 해당하는 게시글 리스트와 해당 조건에 맞는 게시글의 총 갯수를 반환한다.
   * @param QueryDto
   * @returns 게시글 리스트, 조건에 맞는 게시글 갯수
   */
  async getPostLists({
    page,
    number,
    categoryId,
    search,
    filter,
  }: QueryDto): Promise<[Posts[], number]> {
    const qb = this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.deleted_at is null')
      .andWhere('reply.deleted_at is null');

    // 게시글 제목, 내용 검색 시
    if (search && filter === 'content') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.description LIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // 댓글 내용 검색 시
    if (search && filter === 'reply') {
      qb.andWhere('reply.comment LIKE :search', { search: `%${search}%` });
    }

    // 유저 닉네임 검색 시
    if (search && filter === 'nickname') {
      qb.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${search}%`,
      });
    }

    // 카테고리 검색 시
    if (categoryId !== 0) {
      qb.andWhere('post.categoryId = :categoryId ', { categoryId });
    }

    // pagenation
    return await qb
      .take(number)
      .skip((page - 1) * number)
      .orderBy('post.created_at', 'DESC')
      .getManyAndCount();
  }

  /**
   * 유저가 작성한 게시글 리스트와 총 갯수를 반환한다.
   * @param userId 유저 id
   * @returns 게시글 리스트, 게시글 갯수
   */
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

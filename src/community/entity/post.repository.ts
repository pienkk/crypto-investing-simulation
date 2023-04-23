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
   * 조건에 맞는 게시글 리스트, 게시글 갯수 반환
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
      .where('post.isPublished = true');

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

    // 페이지네이션
    return await qb
      .take(number)
      .skip((page - 1) * number)
      .orderBy('post.created_at', 'DESC')
      .getManyAndCount();
  }

  /**
   * 유저가 작성한 게시글 리스트 반환
   */
  async getUserPosts(
    userId: number,
    page: number,
    number: number,
  ): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.userId =:userId', { userId })
      .andWhere('post.isPublished = true')
      .orderBy('post.created_at', 'DESC')
      .take(number)
      .skip((page - 1) * number)
      .getManyAndCount();
  }

  /**
   * 유저가 작성한 댓글의 게시글 조회
   */
  async getUserReplyByPosts(
    userId: number,
    page: number,
    number: number,
  ): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('reply.userId =:userId', { userId })
      .orderBy('post.created_at', 'DESC')
      .take(number)
      .skip((page - 1) * number)
      .getManyAndCount();
  }

  /**
   * 유저가 좋아요한 게시글 리스트 반환
   */
  async getLikePosts(
    userId: number,
    page: number,
    number: number,
  ): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .leftJoinAndSelect('post.likes', 'like')
      .where('like.userId =:userId', { userId })
      .andWhere('like.isLike = true')
      .orderBy('post.created_at', 'DESC')
      .take(number)
      .skip((page - 1) * number)
      .getManyAndCount();
  }
}

import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { QueryDto } from '../dto/community-query.dto';
import { Posts } from './post.entity';

@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  // postId에 해당하는 게시글 상세정보 조회
  async getPostDetail(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.id = :id', { id: postId })
      .getOne();
  }

  // QueryDto 필터에 해당하는 게시글 리스트를 반환
  async getPostLists({
    page,
    number,
    content,
    categoryId,
    nickname,
  }: QueryDto): Promise<[Posts[], number]> {
    // 조건을 위한 쿼리 빌더 변수 생성
    const qb = this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.replies', 'reply')
      .where('post.deleted_at is null')
      .andWhere('reply.deleted_at is null');

    // content가 있을 경우 게시글 제목, 게시글 내용, 댓글 내용과 일치하는 content들을 모두 반환
    if (content !== '') {
      qb.orWhere('post.title LIKE :content', { content: `%${content}%` })
        .orWhere('post.description LIKE :content', { content: `%${content}%` })
        .orWhere('reply.comment LIKE :content', { conetent: `%${content}%` });
    }

    // nickname이 있을 경우 nickname이 포함된 유저의 게시글 리스트를 반환
    if (nickname !== '') {
      qb.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${nickname}%`,
      });
    }

    // categoryId가 0이 아닐 경우 해당 categoryId에 해당하는 리스트를 반환
    if (categoryId !== 0) {
      qb.andWhere('post.categoryId = :categoryId ', { categoryId });
    }

    return await qb
      .take(number)
      .skip((page - 1) * number)
      .orderBy('post.created_at', 'DESC')
      .getManyAndCount();
  }

  // 특정 유저의 게시글 리스트 반환
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

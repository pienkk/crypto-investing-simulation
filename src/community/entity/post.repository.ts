import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { QueryDto } from '../dto/community-query.dto';
import { Posts } from './post.entity';

@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  async getPostDetail(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('post.id = :id', { id: postId })
      .getOne();
  }

  async getPostLists({
    page,
    number,
    title,
  }: QueryDto): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('post.title LIKE :title', { title: `%${title}%` })
      .take(number)
      .skip(page - 1)
      .getManyAndCount();
  }

  async getPostByOne(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('post.id = :postId', { postId })
      .getOne();
  }
}

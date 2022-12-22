import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { QueryDto } from '../dto/community-query.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Posts } from './post.entity';

@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  async getPostLists({
    page,
    number,
    title,
  }: QueryDto): Promise<[Posts[], number]> {
    return await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.user', 'user')
      .where('posts.title LIKE :title', { title: `%${title}%` })
      .take(number)
      .skip(page - 1)
      .getManyAndCount();
  }

  async getPostByOne(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.user', 'user')
      .where('posts.id = :postId', { postId })
      .getOne();
  }

  async createPost(createPostDto: CreatePostDto): Promise<Posts> {
    return await this.save(createPostDto);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    return await this.update(id, updatePostDto);
  }

  async removePost(post: Posts) {
    return await this.delete(post);
  }

  async getPostExistByUser(postId: number, userId: number): Promise<Posts> {
    return await this.findOneBy({ id: postId, userId: userId });
  }
}

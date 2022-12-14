import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { QueryDto } from '../dto/query.dto';
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

  async getOne(postId: number): Promise<Posts> {
    return await this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.replies', 'replies')
      .where('posts.id = :postId', { postId })
      .getOne();
  }

  async createPost(createPostDto: CreatePostDto): Promise<Posts> {
    return await this.save(createPostDto);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    await await this.update(id, updatePostDto);
    return;
  }

  async removePost(post: Posts): Promise<void> {
    console.log(post);
    const a = await this.remove(post);
    console.log(a);
    return;
  }

  async getPostExistByUser(userId: number): Promise<boolean> {
    const result = await this.findOneBy({ id: userId });
    if (!result) return false;
    return true;
  }
}

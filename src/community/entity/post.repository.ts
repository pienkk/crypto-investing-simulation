import { CustomRepository } from 'src/config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPostListsDto } from '../dto/get-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostDetail, Posts } from './post.entity';

@CustomRepository(Posts)
export class PostRepository extends Repository<Posts> {
  async getPostLists({
    page,
    number,
  }: GetPostListsDto): Promise<[Posts[], number]> {
    return await this.findAndCount({
      take: number,
      skip: (page - 1) * number,
    });
  }

  async getOne(postId: number): Promise<PostDetail> {
    return await this.findOneBy({ id: postId });
  }

  async createPost(createPostDto: CreatePostDto): Promise<Posts> {
    return await this.save(createPostDto);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    await this.update(id, updatePostDto);
  }
}

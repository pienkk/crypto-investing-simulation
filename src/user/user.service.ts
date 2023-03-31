import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { PostRepository } from 'src/community/entity/post.repository';
import { ReplyRepository } from 'src/community/entity/reply.repository';
import {
  ResponsePostsDto,
  PostListDto,
} from 'src/community/dto/response-post.dto';
import { ResponseReplyDto } from 'src/community/dto/response-reply.dto';
import { User } from './entity/user.entity';
import { ResponseMoneyRankDto } from 'src/ranking/dto/response.moneyRank.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly postRepository: PostRepository,
    private readonly replyRepository: ReplyRepository,
  ) {}

  async userValidation(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async signIn(userId): Promise<{ accessToken: string; userId: number }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const payload: JwtPayload = { id: user.id, email: user.email };

    return { accessToken: this.jwtService.sign(payload), userId: user.id };
  }

  async getUserInfo(userId: number): Promise<ResponseMoneyRankDto> {
    await this.userValidation(userId);

    const userRank = await this.userRepository.getRankByUser(userId);

    return ResponseMoneyRankDto.fromEntity(userRank);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { PostRepository } from 'src/community/entity/post.repository';
import { ReplyRepository } from 'src/community/entity/reply.repository';
import { User } from './entity/user.entity';
import { ResponseMoneyRankDto } from 'src/ranking/dto/response.moneyRank.dto';
import { PageNationDto } from '../community/dto/community-query.dto';
import { SignInDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly jwtService: JwtService,
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

  /**
   * 유저 정보 조회
   */
  async getUserInfo(userId: number): Promise<ResponseMoneyRankDto> {
    await this.userValidation(userId);

    const userRank = await this.userRepository.getRankByUser(userId);

    return ResponseMoneyRankDto.fromEntity(userRank);
  }

  /**
   * 본인의 숨김 게시글 조회
   */
  async getMyDeletePosts(userId: number) {
    await this.userValidation(userId);

    const posts = await this.postRepository.find({
      where: {
        userId,
        isPublished: false,
      },
    });

    return posts;
  }

  /**
   * 소셜 로그인
   */
  async socialLogin(
    socialLoginDto: SignInDto,
  ): Promise<{ accessToken: string; nickname: string }> {
    // 유저가 없으면 생성
    // 닉네임이 같이 들어오면 신규가입
    if (socialLoginDto.nickname !== undefined) {
      await this.userRepository.save(socialLoginDto);
    }

    const user = await this.userRepository.findOneBy({
      email: socialLoginDto.email,
    });

    // 가입되지 않은 유저일 경우 에러 반환
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const payload: JwtPayload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      nickname: user.nickname,
    };
  }
}

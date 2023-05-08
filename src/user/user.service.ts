import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { PostRepository } from 'src/community/entity/post.repository';
import { User } from './entity/user.entity';
import { RequestSignInDto } from './dto/request-user.dto';
import {
  ResponsePostDto,
  ResponsePostPageNationDto,
} from 'src/community/dto/response-post.dto';
import {
  ResponseSignInDto,
  ResponseUserCountDto,
  ResponseUserInfoDto,
} from './dto/response-user.dto';
import { PageNationDto } from 'src/community/dto/request-query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 유저 유효성 검사
   */
  async userValidation(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  /**
   * 유저 정보 조회
   */
  async getUserInfo(userId: number): Promise<ResponseUserInfoDto> {
    await this.userValidation(userId);

    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'replies'],
    });
    const userRank = await this.userRepository.getRankByUser(userId);

    return ResponseUserInfoDto.fromEntity(userInfo, userRank);
  }

  /**
   * 닉네임 중복체크
   */
  async checkNickname(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ nickname });

    return user ? true : false;
  }

  /**
   * 본인의 숨김 게시글 조회
   */
  async getMyDeletePosts(
    userId: number,
    query: PageNationDto,
  ): Promise<ResponsePostPageNationDto> {
    await this.userValidation(userId);

    const [posts, number] = await this.postRepository.findAndCount({
      where: {
        userId,
        isPublished: false,
      },
      relations: ['user', 'replies'],
      take: query.number,
      skip: (query.page - 1) * query.number,
    });

    const postsToEntity = ResponsePostDto.fromEntities(posts);
    const responsePosts: ResponsePostPageNationDto = {
      post: postsToEntity,
      number,
    };

    return responsePosts;
  }

  /**
   * 소셜 로그인
   */
  async socialLogin(
    socialLoginDto: RequestSignInDto,
  ): Promise<ResponseSignInDto> {
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
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const payload: JwtPayload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      nickname: user.nickname,
      id: user.id,
    };
  }

  /**
   * 유저수 조회
   */
  async getUserCount(): Promise<ResponseUserCountDto> {
    const userCount = await this.userRepository.count();

    return { count: userCount };
  }
}

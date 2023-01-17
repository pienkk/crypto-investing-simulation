import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/entity/user.repository';
import { ResponseIncomeRankDto } from './dto/response.incomeRank.dto';
import { ResponseMoneyRankDto } from './dto/response.moneyRank.dto';

@Injectable()
export class RankingService {
  constructor(private readonly userRepository: UserRepository) {}
  async getMoneyRanking(): Promise<ResponseMoneyRankDto[]> {
    const entity = await this.userRepository.getMoneyRank();

    return ResponseMoneyRankDto.fromEntities(entity);
  }

  async getIncomeRanking(order: string): Promise<ResponseIncomeRankDto[]> {
    const entity = await this.userRepository.getIncomeRank(order);

    return ResponseIncomeRankDto.fromEntities(entity);
  }
}

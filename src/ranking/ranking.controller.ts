import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseIncomeRankDto } from './dto/response.incomeRank.dto';
import { ResponseMoneyRankDto } from './dto/response.moneyRank.dto';
import { RankingService } from './ranking.service';
import { Try, createResponseForm } from 'src/types';
import { responseArraySchema } from 'src/types/swagger';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('money')
  @ApiOperation({
    summary: '소지금 랭킹 조회 API',
    description: '소지금 랭킹 순위의 유저 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseMoneyRankDto)
  @ApiResponse({
    status: 200,
    schema: responseArraySchema(ResponseMoneyRankDto),
  })
  async getMoneyRanking(): Promise<Try<ResponseMoneyRankDto[]>> {
    const moneyRank = await this.rankingService.getMoneyRanking();

    return createResponseForm(moneyRank);
  }

  @Get('income')
  @ApiOperation({
    summary: '수익금 랭킹 조회 API',
    description: '수익금 랭킹 순위의 유저 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseIncomeRankDto)
  @ApiResponse({
    status: 200,
    schema: responseArraySchema(ResponseIncomeRankDto),
  })
  async getIncomeRanking(): Promise<Try<ResponseIncomeRankDto[]>> {
    const incomeRank = await this.rankingService.getIncomeRanking(
      'incomeMoney',
    );

    return createResponseForm(incomeRank);
  }

  @Get('incomepercent')
  @ApiOperation({
    summary: '수익률 랭킹 조회 API',
    description: '수익률 랭킹 순위의 유저 리스트를 반환한다.',
  })
  @ApiExtraModels(ResponseIncomeRankDto)
  @ApiResponse({
    status: 200,
    schema: responseArraySchema(ResponseIncomeRankDto),
  })
  async getIncomePercentRanking(): Promise<Try<ResponseIncomeRankDto[]>> {
    const incomeRank = await this.rankingService.getIncomeRanking(
      'incomePercent',
    );

    return createResponseForm(incomeRank);
  }
}

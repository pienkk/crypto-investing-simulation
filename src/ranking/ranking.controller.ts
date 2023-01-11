import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseIncomeRankDto } from './dto/response.incomeRank.dto';
import { ResponseMoneyRankDto } from './dto/response.moneyRank.dto';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('money')
  @ApiOperation({
    summary: '소지금 랭킹 조회 API',
    description: '소지금 랭킹 순위를 조회한다.',
  })
  @ApiOkResponse({ type: ResponseMoneyRankDto, isArray: true })
  getMoneyRanking(): Promise<ResponseMoneyRankDto[]> {
    return this.rankingService.getMoneyRanking();
  }

  @Get('income')
  @ApiOperation({
    summary: '수익금 랭킹 조회 API',
    description: '수익금 랭킹 순위를 조회한다.',
  })
  @ApiOkResponse({ type: ResponseIncomeRankDto, isArray: true })
  getIncomeRanking(): Promise<ResponseIncomeRankDto[]> {
    return this.rankingService.getIncomeRanking('incomeMoney');
  }

  @Get('incomepercent')
  @ApiOperation({
    summary: '수익률 랭킹 조회 API',
    description: '수익률 랭킹 순위를 조회한다.',
  })
  @ApiOkResponse({ type: ResponseIncomeRankDto, isArray: true })
  getIncomePercentRanking(): Promise<ResponseIncomeRankDto[]> {
    return this.rankingService.getIncomeRanking('incomePercent');
  }
}

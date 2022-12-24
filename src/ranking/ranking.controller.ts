import { Controller, Get } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('money')
  getMoneyRanking() {
    return this.rankingService.getMoneyRanking();
  }

  @Get('income')
  getIncomeRanking() {
    return this.rankingService.getIncomeRanking('incomeMoney');
  }

  @Get('incomepercent')
  getIncomePercentRanking() {
    return this.rankingService.getIncomeRanking('incomePercent');
  }
}

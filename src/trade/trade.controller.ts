import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTradeDto } from './dto/create.trade.dto';
import { ResponseAmountDto } from './dto/response.amount.dto';
import { ResponseTradeDto } from './dto/response.trade.dto';
import { Trade } from './entity/trade.entity';
import { TradeService } from './trade.service';

@ApiTags('Trade')
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  @ApiOperation({
    summary: '거래 목록 조회 API',
    description: '코인 거래 목록을 조회한다.',
  })
  @ApiOkResponse({ type: ResponseTradeDto, isArray: true })
  getTradeHistories(
    @Query('userId') userId: number,
  ): Promise<ResponseTradeDto[]> {
    return this.tradeService.getTradeAll(userId);
  }

  @Get(':symbol')
  @ApiOperation({
    summary: '코인 정보, 유저 정보 조회 API',
    description: '코인 정보, 유저 소지금액, 코인 소지 개수를 조회한다.',
  })
  @ApiOkResponse({ type: ResponseAmountDto })
  getAmountAndCoin(
    @Param('symbol') symbol: string,
    @Query('userId') userId: number,
  ): Promise<ResponseAmountDto> {
    return this.tradeService.getAmount(userId, symbol);
  }

  @Post()
  @ApiOperation({
    summary: '코인 거래 API',
    description: '코인 구매, 판매 주문을 실행한다.',
  })
  @ApiCreatedResponse({ description: '코인을 주문한다.', type: Trade })
  @ApiBody({ type: CreateTradeDto })
  createTrade(@Body() createTradeDto: CreateTradeDto): Promise<Trade> {
    return this.tradeService.createTrade(createTradeDto);
  }

  @Delete(':tradeId')
  @ApiOperation({
    summary: '코인 거래 취소 API',
    description: '코인 거래중인 내역을 취소한다.',
  })
  cancelTrade(@Param('tradeId') tradeId: number) {
    this.tradeService.cancelTrade(tradeId);
    return;
  }
}

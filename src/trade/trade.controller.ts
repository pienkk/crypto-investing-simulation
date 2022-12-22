import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { symbol } from 'joi';
import { CreateTradeDto } from './dto/create.trade.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  getTradeHistories(@Query('userId') userId: number) {
    return this.tradeService.getTradeAll(userId);
  }

  @Get(':symbol')
  getAmountAndCoin(
    @Param('symbol') symbol: string,
    @Query('userId') userId: number,
  ) {
    return this.tradeService.getAmount(userId, symbol);
  }

  @Post()
  createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradeService.createTrade(createTradeDto);
  }

  @Delete(':tradeId')
  cancelTrade(@Param('tradeId') tradeId: number) {
    this.tradeService.cancelTrade(tradeId);
    return;
  }
}

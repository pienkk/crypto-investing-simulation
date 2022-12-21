import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTradeDto } from './dto/create.trade.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  getTradeHistories(@Query('userId') userId: number) {
    return this.tradeService.getTradeAll(userId);
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

  @Get('test')
  test() {
    return this.tradeService.coin();
  }
}

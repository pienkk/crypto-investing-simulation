import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { CreateTradeDto } from './dto/create.trade.dto';
import { ResponseAmountDto } from './dto/response.amount.dto';
import { ResponseTradeDto } from './dto/response.trade.dto';
import { TradeEntity } from './entity/trade.entity';
import { TradeService } from './trade.service';
import { Try, createResponseForm } from 'src/types';
import {
  responseArraySchema,
  responseBooleanSchema,
  responseErrorSchema,
  responseObjectSchema,
} from 'src/types/swagger';

@ApiTags('TradeEntity')
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  @ApiOperation({
    summary: '거래 목록 조회 API',
    description: '코인 거래 목록을 조회한다.',
  })
  @ApiExtraModels(ResponseTradeDto)
  @ApiResponse({ status: 200, schema: responseArraySchema(ResponseTradeDto) })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getTradeHistories(
    @CurrentUser() user: JwtPayload,
  ): Promise<Try<ResponseTradeDto[]>> {
    const trades = await this.tradeService.getTradeAll(user.id);

    return createResponseForm(trades);
  }

  @Get(':symbol')
  @ApiOperation({
    summary: '코인 정보, 유저 정보 조회 API',
    description: '코인 정보, 유저 소지금액, 코인 소지 개수를 조회한다.',
  })
  @ApiExtraModels(ResponseAmountDto)
  @ApiResponse({ status: 200, schema: responseObjectSchema(ResponseAmountDto) })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAmountAndCoin(
    @CurrentUser() user: JwtPayload,
    @Param('symbol') symbol: string,
  ): Promise<Try<ResponseAmountDto>> {
    const amount = await this.tradeService.getAmount(user.id, symbol);

    return createResponseForm(amount);
  }

  @Post()
  @ApiOperation({
    summary: '코인 거래 API',
    description: '코인 구매, 판매 주문을 실행한다.',
  })
  @ApiExtraModels(TradeEntity)
  @ApiResponse({ status: 201, schema: responseObjectSchema(TradeEntity) })
  @ApiBody({ type: CreateTradeDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createTrade(
    @CurrentUser() user: JwtPayload,
    @Body() createTradeDto: CreateTradeDto,
  ): Promise<Try<TradeEntity>> {
    const trade = await this.tradeService.createTrade(createTradeDto, user.id);

    return createResponseForm(trade);
  }

  @Delete(':tradeId')
  @ApiOperation({
    summary: '코인 거래 취소 API',
    description: '코인 거래중인 내역을 취소한다.',
  })
  @ApiResponse({ status: 204, schema: responseBooleanSchema() })
  @ApiForbiddenResponse({
    description: '거래중이 아닌 주문을 취소하려고 할 때',
    schema: responseErrorSchema('거래중인 주문만 취소할 수 있습니다.'),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async cancelTrade(
    @CurrentUser() user: JwtPayload,
    @Param('tradeId') tradeId: number,
  ): Promise<Try<boolean>> {
    const boolean = await this.tradeService.cancelTrade(tradeId, user.id);

    return createResponseForm(boolean);
  }
}

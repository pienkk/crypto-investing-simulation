import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;

      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const error = {
      message: (exception as any).message,
      statusCode: status,
      code,
      path: request.url,
      timestamp: new Date(),
    };

    Logger.error(JSON.stringify(error));

    response.status(status).json(error);
  }
}
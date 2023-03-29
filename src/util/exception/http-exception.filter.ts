import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';
    console.log(exception.constructor);

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).getResponse();
        break;

      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;

      case TypeORMError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as TypeORMError).message;
        code = (exception as any).code;
        break;

      case BadRequestException:
        status = (exception as any).status;
        message = (exception as any).response.message;
        break;

      default:
        message = exception.message;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const error = {
      message,
      statusCode: status,
      code,
      path: request.url,
      timestamp: new Date(),
    };

    Logger.error(JSON.stringify(error));

    response.status(status).json(error);
  }
}

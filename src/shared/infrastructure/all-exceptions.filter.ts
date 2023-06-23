import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidArgument } from '../domain/exceptions/InvalidArgument';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpException = this.getHttpException(exception);

    httpAdapter.reply(
      ctx.getResponse(),
      httpException.getResponse(),
      httpException.getStatus(),
    );
  }

  private getHttpException(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof InvalidArgument) {
      return new BadRequestException(exception.message);
    }

    return new InternalServerErrorException({});
  }
}

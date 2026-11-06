import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { NotFound } from '@/shared/domain/exceptions/NotFound';

/** Maps domain exceptions to HTTP responses. Anything unexpected is logged and becomes a generic 500. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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

  private getHttpException(exception: unknown): HttpException {
    if (exception instanceof HttpException) return exception;
    if (exception instanceof InvalidArgument)
      return new BadRequestException(exception.message);
    if (exception instanceof NotFound)
      return new NotFoundException(exception.message);

    // Never leak internal error details to the client.
    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );
    return new InternalServerErrorException();
  }
}

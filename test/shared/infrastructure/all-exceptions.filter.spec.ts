import { ArgumentsHost, ConflictException, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { NotFound } from '@/shared/domain/exceptions/NotFound';
import { AllExceptionsFilter } from '@/shared/infrastructure/all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const reply = jest.fn();
  const adapterHost = { httpAdapter: { reply } } as unknown as HttpAdapterHost;
  const host = {
    switchToHttp: () => ({ getResponse: () => ({}) }),
  } as unknown as ArgumentsHost;
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    reply.mockClear();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    filter = new AllExceptionsFilter(adapterHost);
  });

  const replyFor = (exception: unknown) => {
    filter.catch(exception, host);
    const [, body, status] = reply.mock.calls[0] as [unknown, unknown, number];
    return { body, status };
  };

  it('maps InvalidArgument to 400 with its message', () => {
    expect(replyFor(new InvalidArgument('bad value'))).toEqual({
      status: 400,
      body: expect.objectContaining({ message: 'bad value' }),
    });
  });

  it('maps NotFound to 404 with its message', () => {
    expect(replyFor(new NotFound('missing'))).toEqual({
      status: 404,
      body: expect.objectContaining({ message: 'missing' }),
    });
  });

  it('passes HttpExceptions through', () => {
    expect(replyFor(new ConflictException('taken')).status).toBe(409);
  });

  it('returns a generic 500 without leaking the error message, and logs it', () => {
    const { status, body } = replyFor(new Error('SQLITE_ERROR: secret'));

    expect(status).toBe(500);
    expect(JSON.stringify(body)).not.toContain('secret');
    expect(Logger.prototype.error).toHaveBeenCalled();
  });

  it('handles non-Error values as a generic 500', () => {
    expect(replyFor('boom').status).toBe(500);
  });
});

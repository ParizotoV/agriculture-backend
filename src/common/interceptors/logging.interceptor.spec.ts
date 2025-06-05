/* eslint-disable @typescript-eslint/no-unsafe-return */

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    interceptor = new LoggingInterceptor();
  });

  it('deve fazer log de nível "info" em requisição bem-sucedida', (done) => {
    const fakeRequest = { method: 'GET', url: '/test' } as any;
    const fakeResponse = { statusCode: 200 } as any;

    const context = {
      switchToHttp: () => ({
        getRequest: () => fakeRequest,
        getResponse: () => fakeResponse,
        getNext: () => null,
      }),
    } as any as ExecutionContext;

    const handler = {
      handle: () => of(null),
    } as any as CallHandler;

    const infoSpy = jest
      .spyOn(interceptor['logger'], 'info')
      .mockImplementation(() => interceptor['logger']);

    interceptor.intercept(context, handler).subscribe({
      complete: () => {
        expect(infoSpy).toHaveBeenCalled();
        const messageArg = infoSpy.mock.calls[0][0] as unknown as string;
        expect(messageArg).toMatch(/GET \/test 200 - \d+ms/);
        infoSpy.mockRestore();
        done();
      },
    });
  });

  it('deve fazer log de nível "error" em exceção com status >= 500', (done) => {
    const fakeRequest = { method: 'POST', url: '/error' } as any;
    const fakeResponse = { statusCode: 500 } as any;
    const testError = new Error('Something bad happened');

    const context = {
      switchToHttp: () => ({
        getRequest: () => fakeRequest,
        getResponse: () => fakeResponse,
        getNext: () => null,
      }),
    } as any as ExecutionContext;

    const handler = {
      handle: () => throwError(() => testError),
    } as any as CallHandler;

    const errorSpy = jest
      .spyOn(interceptor['logger'], 'error')
      .mockImplementation(() => interceptor['logger']);

    interceptor.intercept(context, handler).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalled();
        const callArgs = errorSpy.mock.calls[0] as unknown as any[];
        const loggedMessage = callArgs[0] as unknown as string;
        const meta = callArgs[1];
        expect(loggedMessage).toMatch(/POST \/error 500 - Error: Something bad happened/);
        expect(meta).toHaveProperty('stack', testError.stack);
        errorSpy.mockRestore();
        done();
      },
    });
  });

  it('deve fazer log de nível "warn" quando status < 500', (done) => {
    const fakeRequest = { method: 'DELETE', url: '/warn' } as any;
    const fakeResponse = { statusCode: 404 } as any;
    const testError = new Error('Not found');

    const context = {
      switchToHttp: () => ({
        getRequest: () => fakeRequest,
        getResponse: () => fakeResponse,
        getNext: () => null,
      }),
    } as any as ExecutionContext;

    const handler = {
      handle: () => throwError(() => testError),
    } as any as CallHandler;

    const warnSpy = jest
      .spyOn(interceptor['logger'], 'warn')
      .mockImplementation(() => interceptor['logger']);

    interceptor.intercept(context, handler).subscribe({
      error: () => {
        expect(warnSpy).toHaveBeenCalled();
        const messageArg = warnSpy.mock.calls[0][0] as unknown as string;
        expect(messageArg).toMatch(/DELETE \/warn 404 - Error: Not found/);
        warnSpy.mockRestore();
        done();
      },
    });
  });
});

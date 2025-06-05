import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as winston from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: winston.Logger;

  constructor() {
    const { combine, timestamp, printf, colorize, json } = winston.format;

    const logFormat = printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    });

    const consoleTransport = new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
      ),
    });

    const httpTransport = new winston.transports.Http({
      level: 'error',
      host: 'logging.example.com',
      port: 443,
      path: '/ingest',
      ssl: true,
      format: combine(timestamp(), json()),
    });

    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        consoleTransport,
        ...(process.env.NODE_ENV === 'production' ? [httpTransport] : []),
      ],
      exitOnError: false,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = String(req.method);
    const url = String(req.url);
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const status = res.statusCode;

          this.logger.info(`${method} ${url} ${status} - ${Date.now() - now}ms`);
        },
        error: (err: unknown) => {
          const res = context.switchToHttp().getResponse();
          const status = (res?.statusCode as number) || 500;

          const message = err instanceof Error ? err.message : String(err);
          const logMessage = `${method} ${url} ${status} - Error: ${message}`;

          if (status >= 500) {
            const stack = err instanceof Error ? err.stack : undefined;
            this.logger.error(logMessage, { stack });
          } else {
            this.logger.warn(logMessage);
          }
        },
      }),
    );
  }
}

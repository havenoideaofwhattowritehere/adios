import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppLogger } from '../../../logging/logger.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current();
    return next.handle().pipe(
      map((res: any) => this.responseHandler(res)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context, i18n)),
      ),
    );
  }

  errorHandler(
    exception: HttpException,
    context: ExecutionContext,
    i18n: I18nContext,
  ) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorName = i18n.t(`${i18n.lang}.errors.names.${exception.name}`, {
      lang: i18n.lang,
    });
    const errorMessage = i18n.t(
      `${i18n.lang}.errors.messages.${exception.message}`,
      {
        lang: i18n.lang,
      },
    );

    this.logger.error(`(${status}) ${errorName}: ${errorMessage}`);
    response.status(status).json({
      error: errorName,
      message: errorMessage,
    });
  }

  responseHandler(res: any) {
    return {
      data: res,
    };
  }
}

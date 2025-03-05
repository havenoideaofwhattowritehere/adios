import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '../common/constants/language';

export const CurrentLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const language = request.headers['lang'];
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return DEFAULT_LANGUAGE;
    }

    return language;
  },
);

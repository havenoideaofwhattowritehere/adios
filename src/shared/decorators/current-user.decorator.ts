import { Logger } from '@nestjs/common';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ErrorMap } from '../common/utils/response/error.map';
import { User } from '../../modules/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<User> => {
    const logger = new Logger('CurrentUserDecorator');
    const request = ctx.switchToHttp().getRequest();
    const i18n = request.i18nService as I18nService;

    const user = request.user;
    if (!user) {
      const errorMessage = i18n.translate(`errors.${ErrorMap.USER_NOT_FOUND}`);
      throw new UnauthorizedException(errorMessage);
    }

    logger.log(`CurrentUser with ID ${user.auth0UserId} was found in request`);
    return user;
  },
);

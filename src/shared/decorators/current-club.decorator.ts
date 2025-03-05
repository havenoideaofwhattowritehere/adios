import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { Club } from '../../modules/club/entities/club.entity';

export const CurrentClub = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Promise<Club> => {
    const logger = new Logger('CurrentClubDecorator');

    const request = ctx.switchToHttp().getRequest();
    const currentClub = request.currentClub;

    if (!currentClub) {
      logger.error('No current club found in request');
      throw new UnauthorizedException('No current club found in request');
    }

    logger.log(`CurrentClub with ID ${currentClub.id} was found in request`);
    return currentClub;
  },
);

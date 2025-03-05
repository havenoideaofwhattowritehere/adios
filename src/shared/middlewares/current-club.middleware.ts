import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UUID } from 'crypto';

import { ClubService } from '../../modules/club/club.service';
import { Club } from '../../modules/club/entities/club.entity';

@Injectable()
export class CurrentClubMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CurrentClubMiddleware.name);

  constructor(private readonly clubService: ClubService) {}

  async use(
    req: Request & { currentClub?: Club },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const clubId = req.headers['current_club_id'] as UUID;

    if (!clubId) {
      this.logger.warn(
        `Club ID not provided in headers. Continuing without current club.`,
      );
      next();
      return;
    }

    const club = await this.clubService.getClub(clubId);
    if (!club) {
      this.logger.error(`Club with ID ${club.id} not found`);
      throw new UnauthorizedException(`Club with ID ${club.id} not found`);
    }

    this.logger.log(`Club with ID ${club.id} was found in headers`);
    req.currentClub = club;
    next();
  }
}

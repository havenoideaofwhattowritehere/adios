import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ClubService } from '../../../modules/club/club.service';
import { UserService } from '../../../modules/user/user.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly userService: UserService,
    private readonly clubService: ClubService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      this.logger.error('Not authenticated');
      return false;
    }

    const userAuth0Id = request.user?.auth0UserId;
    if (!userAuth0Id) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const user = await this.userService.getMe(userAuth0Id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    request.currentUser = user;

    const clubId = request.headers['current_club_id'] as string;
    if (clubId) {
      const club = await this.clubService.getClub(clubId);
      if (!club) {
        throw new UnauthorizedException(`Club with ID ${clubId} not found`);
      }
      request.currentClub = club;
    } else {
      this.logger.warn('No current club ID provided in headers.');
    }

    return true;
  }
}

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/create-auth-register.dto';
import { User } from '../../modules/user/entities/user.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(AuthGuard('jwt'))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @CurrentUser() user: User,
    @Body() authRegisterDto: AuthRegisterDto,
  ): Promise<User> {
    const auth0UserId = user.auth0UserId;
    // const roles = [UserRole.trainer, UserRole.sportClubAdmin];
    // await this.authService.addRolesToUser(auth0UserId, roles);
    return this.authService.register(auth0UserId, authRegisterDto);
  }
}

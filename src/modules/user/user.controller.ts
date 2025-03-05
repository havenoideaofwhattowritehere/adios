import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UUID } from '../../shared/common/interfaces/types';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { AppLogger } from '../../shared/logging/logger.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => User })
  async userMe(
    @CurrentUser() user: User,
  ): Promise<User | { isRegistrationCompleted: boolean }> {
    const auth0UserId = user.auth0UserId;
    return this.userService.getUserMe(auth0UserId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => User })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => User, isArray: true })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => User })
  async getUser(@Param('id') id: UUID): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('phone/:phone')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async isPhoneValid(@Param('phone') phone: string): Promise<boolean> {
    return this.userService.isPhoneValid(phone);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => User })
  async updateUser(
    @Param('id') id: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeUser(@Param('id') id: UUID): Promise<boolean> {
    return this.userService.removeUsers([id]);
  }
}

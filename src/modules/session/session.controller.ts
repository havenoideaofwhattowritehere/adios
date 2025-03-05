import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UUID } from '../../shared/common/interfaces/types';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { Club } from '../club/entities/club.entity';
import { SearchSessionsDto } from './dto/search-session.dto';

@ApiTags('Session')
@Controller('session')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => Session })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @CurrentClub() club: Club,
  ): Promise<Session> {
    return this.sessionService.createSession(createSessionDto, club.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Session, isArray: true })
  async getSessions(
    @CurrentClub() club: Club,
    @Query('payload')
    payload?: SearchSessionsDto,
  ): Promise<Session[]> {
    return this.sessionService.getSessions(club.id, payload);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Session })
  async getSession(@Param('id') id: UUID): Promise<Session> {
    return this.sessionService.getSession(id);
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async isNameInClubValid(
    @CurrentClub() club: Club,
    @Param('name') name: string,
  ): Promise<boolean> {
    return this.sessionService.isNameInClubValid(club.id, name);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Session })
  async updateSession(
    @Param('id') id: UUID,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    return this.sessionService.updateSession(id, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeSession(@Param('id') id: UUID): Promise<boolean> {
    return this.sessionService.removeSession(id);
  }
}

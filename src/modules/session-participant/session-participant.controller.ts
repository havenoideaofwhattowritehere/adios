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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';

import { SessionParticipantService } from './session-participant.service';
import { CreateSessionParticipantDto } from './dto/create-session-participant.dto';
import { UpdateSessionParticipantDto } from './dto/update-session-participant.dto';
import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { SessionParticipant } from './entities/session-participant.entity';
import { Club } from '../club/entities/club.entity';

@ApiTags('Session Participant')
@Controller('session-participant')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class SessionParticipantController {
  constructor(
    private readonly sessionParticipantService: SessionParticipantService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => SessionParticipant })
  async createSessionParticipant(
    @Body() createSessionParticipantDto: CreateSessionParticipantDto,
  ): Promise<SessionParticipant> {
    return this.sessionParticipantService.createSessionParticipant(
      createSessionParticipantDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionParticipant, isArray: true })
  async getSessionParticipants(
    @CurrentClub() club: Club,
  ): Promise<SessionParticipant[]> {
    return this.sessionParticipantService.getSessionParticipants(club.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionParticipant })
  async getSessionParticipant(
    @Param('id') id: UUID,
  ): Promise<SessionParticipant> {
    return this.sessionParticipantService.getSessionParticipant(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionParticipant })
  async updateSessionParticipant(
    @Param('id') id: UUID,
    @Body() updateSessionParticipantDto: UpdateSessionParticipantDto,
  ): Promise<SessionParticipant> {
    return this.sessionParticipantService.updateSessionParticipant(
      id,
      updateSessionParticipantDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeSessionParticipant(@Param('id') id: UUID): Promise<boolean> {
    return this.sessionParticipantService.removeSessionParticipant(id);
  }
}

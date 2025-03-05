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

import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { SessionScheduleService } from './session-schedule.service';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';
import { SessionSchedule } from './entities/session-schedule.entity';
import { Club } from '../club/entities/club.entity';

@ApiTags('Session Schedule')
@Controller('sessionSchedule')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class SessionScheduleController {
  constructor(
    private readonly sessionScheduleService: SessionScheduleService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => SessionSchedule })
  async createSessionSchedule(
    @Body() createSessionScheduleDto: CreateSessionScheduleDto,
  ): Promise<SessionSchedule> {
    return this.sessionScheduleService.createSessionSchedule(
      createSessionScheduleDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionSchedule, isArray: true })
  async getSessionSchedules(
    @CurrentClub() club: Club,
  ): Promise<SessionSchedule[]> {
    return this.sessionScheduleService.getSessionSchedules(club.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionSchedule })
  async getSessionSchedule(@Param('id') id: UUID): Promise<SessionSchedule> {
    return this.sessionScheduleService.getSessionSchedule(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionSchedule })
  async updateSessionSchedule(
    @Param('id') id: UUID,
    @Body() updateSessionScheduleDto: UpdateSessionScheduleDto,
  ): Promise<SessionSchedule> {
    return this.sessionScheduleService.updateSessionSchedule(
      id,
      updateSessionScheduleDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeSessionSchedule(@Param('id') id: UUID): Promise<boolean> {
    return this.sessionScheduleService.removeSessionSchedule(id);
  }
}

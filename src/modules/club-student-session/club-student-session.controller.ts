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

import { ClubStudentSessionService } from './club-student-session.service';
import { CreateClubStudentSessionDto } from './dto/create-club-student-session.dto';
import { UpdateClubStudentSessionDto } from './dto/update-club-student-session.dto';
import { ClubStudentSession } from './entities/club-student-session.entity';

@ApiTags('Club Student Session')
@Controller('clubStudentSession')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class ClubStudentSessionController {
  constructor(
    private readonly clubStudentSessionService: ClubStudentSessionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => ClubStudentSession })
  async createClubStudentSession(
    @Body() createClubStudentSessionDto: CreateClubStudentSessionDto,
  ): Promise<ClubStudentSession> {
    return this.clubStudentSessionService.createClubStudentSession(
      createClubStudentSessionDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSession, isArray: true })
  async getClubStudentSessions(): Promise<ClubStudentSession[]> {
    return this.clubStudentSessionService.getClubStudentSessions();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSession })
  async getClubStudentSession(
    @Param('id') id: UUID,
  ): Promise<ClubStudentSession> {
    return this.clubStudentSessionService.getClubStudentSession(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSession })
  async updateClubStudentSession(
    @Param('id') id: UUID,
    @Body() updateClubStudentSessionDto: UpdateClubStudentSessionDto,
  ): Promise<ClubStudentSession> {
    return this.clubStudentSessionService.updateClubStudentSession(
      id,
      updateClubStudentSessionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeClubStudentSession(@Param('id') id: UUID): Promise<boolean> {
    return this.clubStudentSessionService.removeClubStudentSession(id);
  }
}

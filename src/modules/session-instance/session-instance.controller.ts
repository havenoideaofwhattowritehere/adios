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
import { UUID } from 'crypto';

import { SessionInstanceService } from './session-instance.service';
import { CreateSessionInstanceDto } from './dto/create-session-instance.dto';
import { UpdateSessionInstanceDto } from './dto/update-session-instance.dto';
import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { Club } from '../club/entities/club.entity';
import { SessionInstance } from './entities/session-instance.entity';
import { SearchSessionInstanceDto } from './dto/search-session-instance.dto';
import { GetSessionInstanceDto } from './dto/get-session-instance.dto';

@ApiTags('Session Instance')
@Controller('sessionInstance')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class SessionInstanceController {
  constructor(
    private readonly sessionInstanceService: SessionInstanceService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => SessionInstance })
  async createSessionInstance(
    @Body() createSessionInstanceDto: CreateSessionInstanceDto,
    @CurrentClub() club: Club,
  ): Promise<SessionInstance> {
    return this.sessionInstanceService.createSessionInstance(
      createSessionInstanceDto,
      club.id,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionInstance, isArray: true })
  async getSessionInstances(
    @CurrentClub() club: Club,
    @Query('payload')
    payload?: SearchSessionInstanceDto,
  ): Promise<GetSessionInstanceDto[]> {
    return this.sessionInstanceService.getSessionInstances(club.id, payload);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionInstance })
  async getSessionInstance(@Param('id') id: UUID): Promise<SessionInstance> {
    return this.sessionInstanceService.getSessionInstance(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SessionInstance })
  async updateSessionInstance(
    @Param('id') id: UUID,
    @Body() updateSessionInstanceDto: UpdateSessionInstanceDto,
  ): Promise<SessionInstance> {
    return this.sessionInstanceService.updateSessionInstance(
      id,
      updateSessionInstanceDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeSessionInstance(@Param('id') id: UUID): Promise<boolean> {
    return this.sessionInstanceService.removeSessionInstance(id);
  }

  // Endpoint /deleteByScheduleId for myself for checking removing all session instances by schedule id

  // @Delete('/deleteByScheduleId/:scheduleId')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: () => Boolean })
  // async removeAllSessionInstancesByScheduleId(
  //   @Param('scheduleId') id: UUID,
  // ): Promise<boolean> {
  //   await this.sessionInstanceService.removeSessionInstancesBySchedule(id);
  //   return true;
  // }
}

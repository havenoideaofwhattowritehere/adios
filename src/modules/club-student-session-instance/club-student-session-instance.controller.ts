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

import { ClubStudentSessionInstanceService } from './club-student-session-instance.service';
import { CreateClubStudentSessionInstanceDto } from './dto/create-club-student-session-instance.dto';
import { UpdateClubStudentSessionInstanceDto } from './dto/update-club-student-session-instance.dto';
import { ClubStudentSessionInstance } from './entities/club-student-session-instance.entity';

@ApiTags('Club Student Session Instance')
@Controller('club-student-session-instance')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class ClubStudentSessionInstanceController {
  constructor(
    private readonly clubStudentSessionInstanceService: ClubStudentSessionInstanceService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: () => ClubStudentSessionInstance })
  async createClubStudentSessionInstance(
    @Body()
    createClubStudentSessionInstanceDto: CreateClubStudentSessionInstanceDto,
  ): Promise<ClubStudentSessionInstance> {
    return this.clubStudentSessionInstanceService.createClubStudentSessionInstance(
      createClubStudentSessionInstanceDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSessionInstance, isArray: true })
  async getClubStudentSessionInstances(): Promise<
    ClubStudentSessionInstance[]
  > {
    return this.clubStudentSessionInstanceService.getClubStudentSessionInstances();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSessionInstance })
  async getClubStudentSessionInstance(
    @Param('id') id: UUID,
  ): Promise<ClubStudentSessionInstance> {
    return this.clubStudentSessionInstanceService.getClubStudentSessionInstance(
      id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudentSessionInstance })
  async updateClubStudentSessionInstance(
    @Param('id') id: UUID,
    @Body()
    updateClubStudentSessionInstanceDto: UpdateClubStudentSessionInstanceDto,
  ): Promise<ClubStudentSessionInstance> {
    return this.clubStudentSessionInstanceService.updateClubStudentSessionInstance(
      id,
      updateClubStudentSessionInstanceDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeClubStudentSessionInstance(
    @Param('id') id: UUID,
  ): Promise<boolean> {
    return this.clubStudentSessionInstanceService.removeClubStudentSessionInstance(
      id,
    );
  }
}

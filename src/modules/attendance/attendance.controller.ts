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
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { Club } from '../club/entities/club.entity';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => Attendance })
  async createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Attendance, isArray: true })
  async getAttendances(@CurrentClub() club: Club): Promise<Attendance[]> {
    return this.attendanceService.getAttendances(club.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Attendance })
  async getAttendance(@Param('id') id: UUID): Promise<Attendance> {
    return this.attendanceService.getAttendance(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Attendance })
  async updateAttendance(
    @Param('id') id: UUID,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeAttendance(@Param('id') id: UUID): Promise<boolean> {
    return this.attendanceService.removeAttendance(id);
  }
}

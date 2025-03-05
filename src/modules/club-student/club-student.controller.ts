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
  Logger,
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
import { ClubStudentService } from './club-student.service';
import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { Club } from '../club/entities/club.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateClubStudentDto } from './dto/create-club-student.dto';
import { ClubStudent } from './entities/club-student.entity';
import { SearchClubStudentsDto } from './dto/search-club-student.dto';
import { GetUserByPhoneDto } from './dto/get-user-by-phone.dto';

@ApiTags('Club Student')
@Controller('clubStudent')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class ClubStudentController {
  private readonly logger = new Logger(ClubStudentController.name);

  constructor(private readonly clubStudentService: ClubStudentService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: () => ClubStudent })
  async createStudent(
    @CurrentClub() club: Club,
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<ClubStudent> {
    this.logger.log(`Creating Student for club: ${club.id}`);
    return this.clubStudentService.registerStudent(createStudentDto, club.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: () => ClubStudent })
  async createClubStudent(
    @Body() createStudentDto: CreateClubStudentDto,
  ): Promise<ClubStudent> {
    return this.clubStudentService.createClubStudent(createStudentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudent, isArray: true })
  async getClubStudents(
    @CurrentClub() club: Club,
    @Query('payload')
    payload?: SearchClubStudentsDto,
  ): Promise<ClubStudent[]> {
    return this.clubStudentService.getClubStudents(club.id, payload);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudent })
  async getClubStudent(@Param('id') id: UUID): Promise<ClubStudent> {
    return this.clubStudentService.getClubStudent(id);
  }

  @Get('phone/:phone')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => GetUserByPhoneDto })
  async getUserByPhone(
    @CurrentClub() club: Club,
    @Param('phone') phone: string,
  ): Promise<GetUserByPhoneDto> {
    return this.clubStudentService.getUserByPhone(club.id, phone);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStudent })
  async updateClubStudent(
    @Param('id') id: UUID,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<ClubStudent> {
    return this.clubStudentService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeClubStudent(@Param('id') id: UUID): Promise<boolean> {
    return this.clubStudentService.removeClubStudent(id);
  }
}

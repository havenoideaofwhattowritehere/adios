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

import { ClubStaffService } from './club-staff.service';
import { CreateClubStaffDto } from './dto/create-club-staff.dto';
import { UpdateClubStaffDto } from './dto/update-club-staff.dto';
import { ClubStaff } from './entities/club-staff.entity';

@ApiTags('Club Staff')
@Controller('clubStaff')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class ClubStaffController {
  constructor(private readonly clubStaffService: ClubStaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => ClubStaff })
  async createClubStaff(
    @Body() createClubStaffDto: CreateClubStaffDto,
  ): Promise<ClubStaff> {
    return this.clubStaffService.createClubStaff(createClubStaffDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStaff, isArray: true })
  async getClubStaffs(): Promise<ClubStaff[]> {
    return this.clubStaffService.getClubStaffs();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStaff })
  async getClubStaff(@Param('id') id: UUID): Promise<ClubStaff> {
    return this.clubStaffService.getClubStaff(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => ClubStaff })
  async updateClubStaff(
    @Param('id') id: UUID,
    @Body() updateClubStaffDto: UpdateClubStaffDto,
  ): Promise<ClubStaff> {
    return this.clubStaffService.updateClubStaff(id, updateClubStaffDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeClubStaff(@Param('id') id: UUID): Promise<boolean> {
    return this.clubStaffService.removeClubStaff(id);
  }
}

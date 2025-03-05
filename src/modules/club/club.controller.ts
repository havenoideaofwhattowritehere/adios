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
import { UUID } from '../../shared/common/interfaces/types';

import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/helpers/roles.enum';
import { User } from '../user/entities/user.entity';

@ApiTags('Club')
@Controller('club')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => Club })
  async createClub(@Body() createClubDto: CreateClubDto): Promise<Club> {
    return this.clubService.createClub(createClubDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Club, isArray: true })
  async getClubs(@CurrentUser() user: User): Promise<Club[]> {
    return this.clubService.getClubsForUser(user.auth0UserId, UserRole.staff);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Club })
  async getClub(@Param('id') id: UUID): Promise<Club> {
    return this.clubService.getClub(id);
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async isNameValid(@Param('name') name: string): Promise<boolean> {
    return this.clubService.isNameValid(name);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Club })
  async updateClub(
    @Param('id') id: UUID,
    @Body() updateClubDto: UpdateClubDto,
  ): Promise<Club> {
    return this.clubService.updateClub(id, updateClubDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeClub(@Param('id') id: UUID): Promise<boolean> {
    return this.clubService.removeClub(id);
  }
}

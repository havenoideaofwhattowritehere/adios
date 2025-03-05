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

import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { Club } from '../club/entities/club.entity';
import { CurrentClub } from '../../shared/decorators/current-club.decorator';
import { SearchLocationsDto } from './dto/search-location.dto';

@ApiTags('Location')
@Controller('location')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => Location })
  async createLocation(
    @Body() createLocationDto: CreateLocationDto,
    @CurrentClub() club: Club,
  ): Promise<Location> {
    return this.locationService.createLocation(createLocationDto, club.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Location, isArray: true })
  async getLocations(
    @CurrentClub() club: Club,
    @Query('payload')
    payload?: SearchLocationsDto,
  ): Promise<Location[]> {
    return this.locationService.getLocations(club.id, payload);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Location })
  async getLocation(@Param('id') id: UUID): Promise<Location> {
    return this.locationService.getLocation(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Location })
  async updateLocation(
    @Param('id') id: UUID,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removeLocation(@Param('id') id: UUID): Promise<boolean> {
    return this.locationService.removeLocation(id);
  }
}

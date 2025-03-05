import { Module } from '@nestjs/common';

import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { locationProviders } from './entities/location.entity';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, ...locationProviders],
  exports: [LocationService],
})
export class LocationModule {}

import { Test, TestingModule } from '@nestjs/testing';

import { LocationController } from '../../src/modules/location/location.controller';
import { LocationModule } from '../../src/modules/location/location.module';
import { LocationService } from '../../src/modules/location/location.service';

describe('LocationModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [LocationModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have Location components', async () => {
    expect(module.get(LocationController)).toBeInstanceOf(LocationController);
    expect(module.get(LocationService)).toBeInstanceOf(LocationService);
  });
});

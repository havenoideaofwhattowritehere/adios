import { Test, TestingModule } from '@nestjs/testing';

import { ClubController } from '../../src/modules/club/club.controller';
import { ClubModule } from '../../src/modules/club/club.module';
import { ClubService } from '../../src/modules/club/club.service';

describe.skip('ClubModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ClubModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have Club components', async () => {
    expect(module.get(ClubController)).toBeInstanceOf(ClubController);
    expect(module.get(ClubService)).toBeInstanceOf(ClubService);
  });
});


import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '../../src/modules/user/user.controller';
import { UserModule } from '../../src/modules/user/user.module';
import { UserService } from '../../src/modules/user/user.service';

describe.skip('UserModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have User components', async () => {
    expect(module.get(UserController)).toBeInstanceOf(UserController);
    expect(module.get(UserService)).toBeInstanceOf(UserService);
  });
});

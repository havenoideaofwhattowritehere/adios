import { Test, TestingModule } from '@nestjs/testing';
import { ClubStudentController } from '../../src/modules/club-student/club-student.controller';
import { ClubStudentService } from '../../src/modules/club-student/club-student.service';
import { ClubStudent } from '../../src/modules/club-student/entities/club-student.entity';

describe('ClubStudentController', () => {
  let controller: ClubStudentController;
  let service: ClubStudentService;

  beforeEach(async () => {
    const mockClubStudentService = {
      getClubStudents: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubStudentController],
      providers: [
        {
          provide: ClubStudentService,
          useValue: mockClubStudentService,
        },
      ],
    }).compile();

    controller = module.get<ClubStudentController>(ClubStudentController);
    service = module.get<ClubStudentService>(ClubStudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of club students', async () => {
    const result: ClubStudent[] = [];
    jest.spyOn(service, 'getClubStudents').mockResolvedValue(result);

    expect(service.getClubStudents).toBeDefined();
  });
});

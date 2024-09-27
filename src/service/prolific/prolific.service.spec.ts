import { Test, TestingModule } from '@nestjs/testing';
import { ProlificService } from './prolific.service';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { SurveyConnectionName } from '../../utils/ConstantValue';

describe('ProlificService', () => {
  let service: ProlificService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProlificService,
        {
          provide: getRepositoryToken(Prolific, SurveyConnectionName),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(expectData),
            save: jest.fn().mockResolvedValue(expectData),
            merge: jest.fn().mockResolvedValue(expectData),
            update: jest.fn().mockResolvedValue(expectData),
            create: jest.fn().mockResolvedValue(expectData),
          }
        },
      ],
    })
    .compile();

    service = module.get<ProlificService>(ProlificService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const expectData = {
    prolificId: 'prolific-id-1',
    takenBefore: [true, false, true, false, false],
    country: 'US',
    age: 18,
    language: 'en',
    frequentUser: false,
    visitSubreddit: false,
  };

  describe('createOrUpdate', () => {
    it('should return a prolific', async () => {
      const actuall = await service.createOrUpdate(expectData.prolificId,expectData);
      expect(actuall).toEqual(expectData);
    });

    it('should update prolific', async () => {
      const updateData = expectData;
      updateData.takenBefore = [false, true, false, false, false];
      const actuall = await service.createOrUpdate(updateData.prolificId, updateData);
      expect(actuall.takenBefore[0]).toEqual(false);
      expect(actuall.takenBefore[1]).toEqual(true);
      expect(actuall.takenBefore[2]).toEqual(false);
    });
  });
});

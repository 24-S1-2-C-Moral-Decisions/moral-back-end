import { Test, TestingModule } from '@nestjs/testing';
import { ProlificService } from './prolific.service';
import { getModelToken } from '@nestjs/mongoose';
import { Prolific } from '../../schemas/prolific.shcemas';

describe('ProlificService', () => {
  let service: ProlificService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProlificService],
    })
    .useMocker((token) => {
      if (token === getModelToken(Prolific.name, 'survey')) {
        return {
          findOneAndUpdate: jest.fn().mockResolvedValue(expectData),
        };
      }
    })
    .compile();

    service = module.get<ProlificService>(ProlificService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const expectData = {
    id: 'prolific-id-1',
    takenBefore: [true, false, true, false, false],
    country: 'US',
    age: 18,
    language: 'en',
    frequentUser: false,
    visitSubreddit: false,
  };

  describe('createOrUpdate', () => {
    it('should return a prolific', async () => {
      const actuall = await service.createOrUpdate(expectData);
      expect(actuall).toEqual(expectData);
    });

    it('should update prolific', async () => {
      const updateData = expectData;
      updateData.takenBefore = [false, true, false, false, false];
      const actuall = await service.createOrUpdate(updateData);
      expect(actuall.takenBefore[0]).toEqual(false);
      expect(actuall.takenBefore[1]).toEqual(true);
      expect(actuall.takenBefore[2]).toEqual(false);
    });
  });
});

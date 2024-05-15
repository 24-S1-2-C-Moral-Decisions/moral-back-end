import { Test, TestingModule } from '@nestjs/testing';
import { ProlificController } from './prolific.controller';
import { ProlificService } from '../../../service/prolific/prolific.service';
import { ProlificDto } from '../../../module/survey/prolific.dto';

describe('ProlificController', () => {
  let controller: ProlificController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProlificController],
    })
    .useMocker((token) => {
      if (token === ProlificService) {
        return {
          findProlificById: jest.fn<Promise<ProlificDto>, [string]>().mockImplementation(async (id) => {
            if (id === expectData.id) {
              return Promise.resolve(expectData);
            }
            return Promise.resolve(null);
          }),
          createOrUpdate: jest.fn<Promise<ProlificDto>, [ProlificDto]>().mockImplementation(async (prolific) => {
            return Promise.resolve(prolific);
          }),
        };
      }
    })
    .compile();

    controller = module.get<ProlificController>(ProlificController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

  describe('postProlific', () => {
    it('should return a prolific', async () => {
      const actuall = await controller.postProlific(expectData);
      expect(actuall).toEqual(expectData);
    });
  });
});

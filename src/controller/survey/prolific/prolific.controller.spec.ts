import { Test, TestingModule } from '@nestjs/testing';
import { ProlificController } from './prolific.controller';
import { ProlificService } from '../../../service/prolific/prolific.service';

describe('ProlificController', () => {
  let controller: ProlificController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProlificController],
      providers: [
        {
          provide: ProlificService,
          useValue: {
            createOrUpdate: jest.fn().mockResolvedValue(expectData),
            findProlificById: jest.fn().mockResolvedValue(expectData),
          },
        },
      ],
    })
    .compile();

    controller = module.get<ProlificController>(ProlificController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

  describe('postProlific', () => {
    it('should return a prolific', async () => {
      const actuall = await controller.postProlific(expectData);
      expect(actuall).toEqual(expectData);
    });
  });
});

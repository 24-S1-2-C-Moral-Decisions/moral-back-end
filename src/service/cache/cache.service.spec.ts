import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { MoralCache } from '../../schemas/cache.shcemas';
import { getModelToken } from '@nestjs/mongoose';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: getModelToken(MoralCache.name, "cache"),
          useValue: {},
        }
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { PostDoc } from '../../schemas/post.shcemas';
import { CacheService } from '../cache/cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoralCache } from '../../entity/Cache';
import { CacheConnectionName, PostConnectionName } from '../../utils/ConstantValue';

const mockSearchService = {
  setupTfidfCache: jest.fn().mockResolvedValue({}),
};

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: getRepositoryToken(MoralCache, CacheConnectionName),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

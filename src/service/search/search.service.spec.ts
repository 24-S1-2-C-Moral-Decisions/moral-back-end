import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { PostDoc } from '../../schemas/post.shcemas';
import { CacheService } from '../cache/cache.service';
import { MoralCache } from '../../schemas/cache.shcemas';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: SearchService,
          useValue: {
            setupTfidfCache: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(MoralCache, 'cache'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(PostDoc.name, 'posts'),
          useValue: {},
        },
        {
          provide: getModelToken(MoralCache.name, 'cache'),
          useValue: {},
        },
        {
          provide: getConnectionToken('posts'),
          useValue: {},
        }
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

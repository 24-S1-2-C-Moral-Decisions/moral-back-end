import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { PostService } from '../../service/post/post.service';
import { SearchService } from '../../service/search/search.service';
import { CacheService } from '../../service/cache/cache.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { MoralCache } from '../../entity/Cache';
import { CacheConnectionName, PostConnectionName } from '../../utils/ConstantValue';
import { PostSummary } from '../../entity/PostSummary';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        PostService,
        CacheService,
        {
          provide: getDataSourceToken(PostConnectionName),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PostSummary, PostConnectionName),
          useValue: {},
        },
        {
          provide: SearchService,
          useValue: {
            setupTfidfCache: jest.fn(),
          },
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

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

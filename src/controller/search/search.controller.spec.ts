import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { PostService } from '../../service/post/post.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { SearchService } from '../../service/search/search.service';
import { PostDoc } from '../../schemas/post.shcemas';
import { CacheService } from '../../service/cache/cache.service';
import { MoralCache } from '../../schemas/cache.shcemas';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {},
        },
        PostService,
        CacheService,
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
          provide: getModelToken(MoralCache.name, 'cache'),
          useValue: {},
        },
        {
          provide: getModelToken(PostDoc.name, 'posts'),
          useValue: {},
        },
        {
          provide: getConnectionToken('posts'),
          useValue: {
            collection: jest.fn().mockRejectedValue({
              countDocuments: jest.fn().mockResolvedValue(1),
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

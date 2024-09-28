import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from '../../service/post/post.service';
import { CacheService } from '../../service/cache/cache.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { MoralCache } from '../../entity/Cache';
import { CacheConnectionName, PostConnectionName } from '../../utils/ConstantValue';
import { PostSummary } from '../../entity/PostSummary';
import { Search } from '@nestjs/common';
import { SearchService } from '../../service/search/search.service';
import { PostMateData } from '../../entity/PostMateData';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PostController
      ],
      providers: [
        PostService,
        CacheService,
        {
          provide: SearchService,
          useValue: {
            setupTfidfCache: jest.fn(),
          },
        },
        {
          provide: getDataSourceToken(PostConnectionName),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PostSummary, PostConnectionName),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
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
        },
      ]
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

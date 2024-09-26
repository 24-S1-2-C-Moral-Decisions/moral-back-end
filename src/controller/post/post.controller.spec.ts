import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { PostService } from '../../service/post/post.service';
import { CacheService } from '../../service/cache/cache.service';
import { MoralCache } from '../../schemas/cache.shcemas';
import { getRepositoryToken } from '@nestjs/typeorm';

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
          provide: getRepositoryToken(MoralCache, 'cache'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: getConnectionToken('posts'),
          useValue: {},
        },
        {
          provide: getModelToken(MoralCache.name, 'cache'),
          useValue: {},
        },
      ]
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

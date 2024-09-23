import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { get } from 'http';
import { getConnectionToken } from '@nestjs/mongoose';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getConnectionToken('posts'),
          useValue: {},
        }
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

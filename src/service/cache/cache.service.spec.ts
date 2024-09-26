import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { MoralCache } from '../../schemas/cache.shcemas';
import { getModelToken } from '@nestjs/mongoose';
import e from 'express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { expectCache } from '../../entity/Cache';
import { cp } from 'fs';

const MoralCacheMockRepository = {
  findOne: jest.fn().mockImplementation(({where: {key}}) => {
    return expectCache.find((cache) => cache.key === key) ?? null;
  }),
  create: jest.fn().mockImplementation((cache) => {
    return cache;
  }),
  save: jest.fn(),
  delete: jest.fn(),
}

describe('CacheService', () => {
  let service: CacheService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: getRepositoryToken(MoralCache, 'cache'),
          useValue: MoralCacheMockRepository,
        }
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('cache should be get', async () => {
    const cache = await service.getCache("validCache");
    expect(MoralCacheMockRepository.delete).not.toHaveBeenCalled();
    expect(cache).toEqual(JSON.parse(expectCache[1].value));
  });

  it('cache should be set', () => {
    service.setCache('key', { value: 'value' })
    expect(MoralCacheMockRepository.create).toHaveBeenCalled();
    expect(MoralCacheMockRepository.save).toHaveBeenCalled();
  });

  it('cache should be delete', async () => {
    await service.getCache("invalidCache");
    expect(MoralCacheMockRepository.delete).toHaveBeenCalled();
  });

  it('cache also should be delete', () => {
    service.deleteCache("invalidCache");
    expect(MoralCacheMockRepository.delete).toHaveBeenCalled();
  });

  it('cache should be undefined', async () => {
    const cache = await service.getCache("invalidCache");
    // expect(MoralCacheMockRepository.delete).toHaveBeenCalled();
    expect(cache).toBeUndefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { expectCache, MoralCache } from '../../entity/Cache';
import { CacheConnectionName } from '../../utils/ConstantValue';

const MoralCacheMockRepository = {
  findOne: jest.fn().mockImplementation(({where: {key}}) => {
    return expectCache.find((cache) => cache.key === key) ?? null;
  }),
  create: jest.fn().mockImplementation((cache) => {
    return cache;
  }),
  update: jest.fn(),
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
          provide: getRepositoryToken(MoralCache, CacheConnectionName),
          useValue: MoralCacheMockRepository,
        }
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('cache should be get', async () => {
    const cache = await service.getCache("validCache");
    expect(MoralCacheMockRepository.findOne).toHaveBeenCalled();
    expect(MoralCacheMockRepository.update).toHaveBeenCalled();
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

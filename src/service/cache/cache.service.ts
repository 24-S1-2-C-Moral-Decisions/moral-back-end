import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoralCache } from '../../entity/Cache';
import { CacheConnectionName } from '../../utils/ConstantValue';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(MoralCache, CacheConnectionName) private cacheRepository: Repository<MoralCache>,
    ) {}

    async getCache(key: string): Promise<Record<string, unknown>> {
        const cacheData = await this.cacheRepository.findOne({ 
            where: { key },
        });

        if (cacheData && cacheData.expiresAt > new Date()) {
            this.cacheRepository.update({ key }, { hit: cacheData.hit + 1 });
            return JSON.parse(cacheData.value);
        }
        if (cacheData) {
            this.deleteCache(key);
        };
        return undefined;
    }

    setCache(key: string, value: object, ttl: number = parseInt(process.env.DEFAULT_CACHE_TTL)){
        // 1 month
        // const ttl = 5; // 5 seconds
        const expiresAt = new Date(Date.now() + ttl * 1000);
        const entity = this.cacheRepository.create({ key, value: JSON.stringify(value), expiresAt , hit: 0 });
        this.cacheRepository.save(entity);
    }

    deleteCache(key: string) {
        this.cacheRepository.delete({ key });
    }

    clearCache() {
        this.cacheRepository.clear();
    }
}

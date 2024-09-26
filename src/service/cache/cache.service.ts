import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoralCache } from '../../entity/Cache';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(MoralCache, 'cache') private cacheRepository: Repository<MoralCache>,
    ) {}

    async getCache(key: string): Promise<Record<string, unknown>> {
        const cacheData = await this.cacheRepository.findOne({ 
            where: { key },
        });

        console.log(cacheData);

        if (cacheData && cacheData.expiresAt > new Date()) {
            console.log('cache hit');
            return JSON.parse(cacheData.value);
        }
        console.log('cache miss');
        if (cacheData) {
            console.log('cache expired');
            this.deleteCache(key);
        };
        return undefined;
    }

    setCache(key: string, value: object, ttl: number = parseInt(process.env.DEFAULT_CACHE_TTL)){
        // 1 month
        // const ttl = 5; // 5 seconds
        const expiresAt = new Date(Date.now() + ttl * 1000);
        const entity = this.cacheRepository.create({ key, value: JSON.stringify(value), expiresAt });
        this.cacheRepository.save(entity);
    }

    deleteCache(key: string) {
        console.log('delete cache');
        this.cacheRepository.delete({ key });
    }
}

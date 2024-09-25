import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoralCache } from '../../schemas/cache.shcemas';

@Injectable()
export class CacheService {
    constructor(@InjectModel(MoralCache.name, 'cache') private cacheModel: Model<MoralCache>) {}

    async getCache(key: string): Promise<object> {
        const cacheData = await this.cacheModel.findOne({ key });
        if (cacheData && cacheData.expiresAt > new Date()) {
            return cacheData.value;
        }
        if (cacheData) this.cacheModel.deleteOne({ key });
        return null;
    }

    async setCache(key: string, value: object): Promise<void> {
        const ttl = 60 * 60 * 24 * 30; // 1 month
        // const ttl = 5; // 5 seconds
        const expiresAt = new Date(Date.now() + ttl * 1000);
        this.cacheModel.updateOne(
          { key },
          { key, value, expiresAt },
          { upsert: true },
        );
    }

    async deleteCache(key: string): Promise<void> {
        this.cacheModel.deleteOne({ key });
    }
}

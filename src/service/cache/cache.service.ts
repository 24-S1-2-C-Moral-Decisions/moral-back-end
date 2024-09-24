import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoralCache } from '../../schemas/cache.shcemas';

@Injectable()
export class CacheService {
    constructor(@InjectModel(MoralCache.name, 'cache') private cacheModel: Model<MoralCache>) {}

    async getCache(key: string): Promise<Record<string, unknown>> {
        const cacheData = await this.cacheModel.findOne({ key });
        if (cacheData && cacheData.expiresAt > new Date()) {
            return JSON.parse(cacheData.value);
        }
        if (cacheData) await this.cacheModel.deleteOne({ key });
        return undefined;
    }

    async setCache(key: string, value: object, ttl: number = 60 * 60 * 24 * 30): Promise<void> {
        // 1 month
        // const ttl = 5; // 5 seconds
        const expiresAt = new Date(Date.now() + ttl * 1000);
        await this.cacheModel.updateOne(
          { key },
          { key, value: JSON.stringify(value), expiresAt },
          { upsert: true },
        );
    }

    async deleteCache(key: string): Promise<void> {
        await this.cacheModel.deleteOne({ key });
    }
}

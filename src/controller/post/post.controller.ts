import { Controller, Get } from '@nestjs/common';
import { PostService } from '../../service/post/post.service';
import { ApiTags } from '@nestjs/swagger';
import { CacheService } from '../../service/cache/cache.service';

@Controller('post')
@ApiTags('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly cacheService: CacheService
    ) {}

    @Get('topics')
    async getTopicList() {
        const cacheKey = 'topicList';
        const cachedData = await this.cacheService.getCache(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const newData = this.postService.getTopicList();
        newData.then((data) => {
            this.cacheService.setCache(cacheKey, data);
        });
        return newData;
    }

    @ApiTags('cache')
    @Get('clearCache')
    async clearCache() {
        await this.cacheService.deleteCache('topicList');
        return 'Cache cleared';
    }
}

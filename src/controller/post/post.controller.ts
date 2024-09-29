import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from '../../service/post/post.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CacheService } from '../../service/cache/cache.service';
import { Type } from 'class-transformer';

const HotPostsCacheKey = 'hotPosts';

class Pageing{
    @ApiProperty({
        name: 'pageSize',
        required: false,
        description: 'The number of posts per page',
        example: 10
    })
    @Type(() => Number)
    pageSize: number;

    @ApiProperty({
        name: 'page',
        required: false,
        description: 'The page number',
        example: 0
    })
    @Type(() => Number)
    page: number;
}

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly cacheService: CacheService
    ) {}

    @Get('topics')
    @ApiTags('post')
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

    @Get('hotPosts')
    @ApiTags('post')
    async getOrderedPosts(@Query() body: Pageing = { pageSize: 10, page: 0 }) {
        const cachedData = await this.cacheService.getCache(HotPostsCacheKey+"_"+body.pageSize+"_"+body.page);

        if (cachedData) {
            return cachedData;
        }

        return this.postService.getPostsOrderedByComments(body.pageSize, body.page).then((data) => {
            this.cacheService.setCache(HotPostsCacheKey+"_"+body.pageSize+"_"+body.page, data);
            return data;
        });
    }

    @ApiTags('cache')
    @Get('clearCache')
    async clearCache() {
        await this.cacheService.clearCache();
        return 'Cache cleared';
    }
}

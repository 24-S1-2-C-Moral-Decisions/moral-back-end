import { Module } from '@nestjs/common';
import { SearchController } from '../../controller/search/search.controller';
import { PostController } from '../../controller/post/post.controller';
import { PostService } from '../../service/post/post.service';
import { CacheService } from '../../service/cache/cache.service';
import { SearchService } from '../../service/search/search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMateData } from '../../entity/PostMateData';
import { PostSummary } from '../../entity/PostSummary';
import { MoralCache } from '../../entity/Cache';
import { CacheConnectionName, PostConnectionName } from '../../utils/ConstantValue';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                PostMateData,
                PostSummary
            ],
            PostConnectionName
        ),
        TypeOrmModule.forFeature(
            [
                MoralCache,
            ],
            CacheConnectionName
        ),
    ],
    controllers: [SearchController, PostController],
    providers: [CacheService, SearchService, PostService],
})
export class PostsModule {}

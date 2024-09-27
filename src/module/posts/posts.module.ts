import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from '../../controller/search/search.controller';
import { PostController } from '../../controller/post/post.controller';
import { PostService } from '../../service/post/post.service';
import { CacheService } from '../../service/cache/cache.service';
import { SearchService } from '../../service/search/search.service';
import { PostDoc, PostDocSchema } from '../../schemas/post.shcemas';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMateData } from '../../entity/PostMateData';
import { PostSummary } from '../../entity/PostSummary';
import { MoralCache } from '../../entity/Cache';
import { EntityManager } from 'typeorm';
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

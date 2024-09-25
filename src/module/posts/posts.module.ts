import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from '../../controller/search/search.controller';
import { PostController } from '../../controller/post/post.controller';
import { PostService } from '../../service/post/post.service';
import { MoralCache, MoralCacheSchema } from '../../schemas/cache.shcemas';
import { CacheService } from '../../service/cache/cache.service';
import { SearchService } from '../../service/search/search.service';
import { PostDoc, PostDocSchema } from '../../schemas/post.shcemas';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                // { name: Question.name, schema: QuestionSchema}
                { name: MoralCache.name , schema: MoralCacheSchema}
            ], 
            'cache'
        ),
        MongooseModule.forFeature(
            [
                { name: PostDoc.name , schema: PostDocSchema}
            ], 
            'posts'
        ),
    ],
    controllers: [SearchController, PostController],
    providers: [PostService, CacheService, SearchService],
})
export class PostsModule {}

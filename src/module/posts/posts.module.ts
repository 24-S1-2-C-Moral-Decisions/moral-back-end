import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from '../../controller/search/search.controller';
import { PostController } from '../../controller/post/post.controller';
import { PostService } from '../../service/post/post.service';
import { MoralCache, MoralCacheSchema } from '../../schemas/cache.shcemas';
import { CacheService } from '../../service/cache/cache.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                // { name: Question.name, schema: QuestionSchema}
                { name: MoralCache.name , schema: MoralCacheSchema}
            ], 
            'cache'
        ),
    ],
    controllers: [SearchController, PostController],
    providers: [PostService, CacheService],
})
export class PostsModule {}

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PostDocDto } from '../../module/posts/post.dto';
import { PostConnectionName, PostsDBName, PostSummaryCollectionName } from '../../utils/ConstantValue';
import { PostSummary } from '../../entity/PostSummary';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, MongoRepository, Repository } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

@Injectable()
export class PostService {
    constructor(@InjectDataSource(PostConnectionName) private postsDataSource: DataSource) {}

    async getTopicList() {
        const queryRunner = this.postsDataSource.createQueryRunner() as MongoQueryRunner;
        const db = queryRunner.databaseConnection.db(PostsDBName);
        const collection = await db.listCollections().toArray();

        const topicList = [] 
        await Promise.all(
            collection.map(async (collection) => {
                if (collection.name == PostSummaryCollectionName){
                    return;
                }
                const count = await db.collection(collection.name).countDocuments();
                topicList.push({
                    name: collection.name,
                    count: count,
                });
            })
        )
        return topicList;
    }

    async getPostsByTopic(topic: string, limit: number = 10 ): Promise<PostSummary[]> {
        const queryRunner = this.postsDataSource.createQueryRunner() as MongoQueryRunner;
        const db = queryRunner.databaseConnection.db(PostsDBName);
        const docsLis = await db.collection(topic).find().limit(limit).toArray();
        const posts = Promise.all(
            docsLis.map(async (doc) => {
                return {
                    id: doc.id,
                    title: doc.title,
                    verdict: doc.verdict,
                    topics: doc.topics,
                    num_comments: doc.num_comments,
                    resolved_verdict: doc.resolved_verdict,
                    selftext: doc.selftext,
                    YTA: doc.YTA,
                    NTA: doc.NTA,
                };
            })
        );
        return posts;
    }
}

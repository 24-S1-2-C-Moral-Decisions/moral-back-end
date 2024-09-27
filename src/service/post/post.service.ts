import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PostDocDto } from '../../module/posts/post.dto';

@Injectable()
export class PostService {
    constructor(@InjectConnection('posts') private readonly posts:Connection ) {}

    async getTopicList() {
        const collection = await this.posts.db.listCollections().toArray();

        const topicList = Promise.all(
            collection.map(async (collection) => {
                const count = await this.posts.db.collection(collection.name).countDocuments();
                return {
                    name: collection.name,
                    count: count,
                };
            })
        )
        return topicList;
    }

    async getPostsByTopic(topic: string, limit: number = 10 ): Promise<PostDocDto[]> {
        const docsLis = await this.posts.db.collection(topic).find().limit(limit);
        const docs = await docsLis.toArray();
        const posts = Promise.all(
            docs.map(async (doc) => {
                return new PostDocDto({
                    _id: doc._id.toString(),
                    title: doc.title,
                    verdict: doc.verdict,
                    topic_1: doc.topic_1,
                    topic_1_p: doc.topic_1_p,
                    topic_2: doc.topic_2,
                    topic_2_p: doc.topic_2_p,
                    topic_3: doc.topic_3,
                    topic_3_p: doc.topic_3_p,
                    topic_4: doc.topic_4,
                    topic_4_p: doc.topic_4_p,
                    num_comments: doc.num_comments,
                    resolved_verdict: doc.resolved_verdict,
                    selftext: doc.selftext,
                    YTA: doc.YTA,
                    NTA: doc.NTA,
                });
            })
        );
        return posts;
    }
}

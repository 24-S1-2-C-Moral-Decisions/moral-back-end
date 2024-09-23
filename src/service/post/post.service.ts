import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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
}

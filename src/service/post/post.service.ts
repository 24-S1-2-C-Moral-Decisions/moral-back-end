import { Injectable } from '@nestjs/common';
import { PostConnectionName, PostsDBName, PostSummaryCollectionName } from '../../utils/ConstantValue';
import { PostSummary } from '../../entity/PostSummary';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { SearchService } from '../search/search.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostSummary, PostConnectionName) private postSummaryRepository: Repository<PostSummary>,
        private searchService: SearchService
    ) {}

    async getTopicList() {
        return Promise.all(
            Array.from(this.searchService.tfidfMap).map(async ([topic, tfidf]) => {
                return {
                    topic,
                    count: tfidf.documents.length
                };
            })
        ).then((data) => {
            return data.sort((a, b) => b.count - a.count);
        });
    }

    async getPostsByTopic(topic: string, pageSize: number = 10, page:number = 0): Promise<PostSummary[]> {
        const ids: string[] = [];
        for (const doc of this.searchService.getTfidf(topic).documents) {
            if (ids.length > pageSize * page) {
                break;
            }
            ids.push(doc.__key as unknown as string);
        }

        const res = Promise.all(
            ids.map(async (id) => {
                return this.postSummaryRepository.findOne({
                    where: {
                        id: id
                    }
                });
            })
        );
        
        return res;
    }
}

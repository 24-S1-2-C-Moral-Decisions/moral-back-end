import { Injectable } from '@nestjs/common';
import { PostConnectionName } from '../../utils/ConstantValue';
import { PostSummary } from '../../entity/PostSummary';
import { SearchService } from '../search/search.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostSummary, PostConnectionName) private postSummaryRepository: Repository<PostSummary>,
        private searchService: SearchService,
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

    async getPostsOrderedByComments(pageSize: number = 10, page: number = 0): Promise<PostSummary[]> {
        return this.postSummaryRepository.find({
            order: {
                commentCount: "DESC"
            },
            take: pageSize,
            skip: page * pageSize
        });
    }

    async getPostsByTopic(topic: string, pageSize: number = 10, page:number = 0): Promise<PostSummary[]> {
        const ids: string[] = [];
        const documents = this.searchService.getTfidf(topic).documents;
        for (let index = pageSize * page; index < pageSize * page + pageSize && index < documents.length; index++) {
            ids.push(documents[index].__key as unknown as string);
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

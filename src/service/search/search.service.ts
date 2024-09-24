import { Injectable, Logger } from '@nestjs/common';
import * as natural from 'natural';
import { CacheService } from '../cache/cache.service';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { PostDocDto } from '../../module/posts/post.dto';
import { PostDoc } from '../../schemas/post.shcemas';

@Injectable()
export class SearchService {
    private tfidf: natural.TfIdf;
    private cacheKey = 'tfidf';

    constructor(
        @InjectModel(PostDoc.name, 'posts') private postModel: Model<PostDoc>,
        @InjectConnection('posts') private readonly poetConnection: Connection,
        private readonly cacheService: CacheService
    ) {
        this.init()
    }

    async init() {
        const tfidfSerialized = await this.cacheService.getCache('tfidf');
        if (tfidfSerialized) {
            this.tfidf = new natural.TfIdf(tfidfSerialized);
        } else {
            this.setupTfidfCache();
        }
    }

    async setupTfidfCache() {
        Logger.log('Setting up tfidf cache', "SearchService");
        this.cacheService.deleteCache(this.cacheKey)
        this.tfidf = new natural.TfIdf();

        for await (const post of this.poetConnection.collection('all').find()) {
            this.tfidf.addDocument(post.selftext, post._id);
            console.log('Added document', post.selftext);
            break;
        }

        // ttl = 100 years (forever)
        // this.cacheService.setCache(this.cacheKey, this.tfidf, 60 * 60 * 24 * 365 * 100);
        Logger.log('Tfidf cache setup complete', "SearchService");
    }

    async search(topic:string, query: string, limit: number = 10): Promise<PostDocDto[]> {

        // TODO: Check whether the tfidf is setting up cache properly
        if (!this.tfidf) {
            throw new Error('Tfidf not initialized');
        }

        const similerList = [];
        this.tfidf.tfidfs(query, (i, measure) => {
            similerList.push({ id: this.tfidf.documents[i], measure });
        });

        // Sort by measure
        similerList.sort((a, b) => b.measure - a.measure);
        const postIds = similerList.map(result => {
            console.log(result.id.__key, result.measure);
            return result.id.__key;
        });

        let res: PostDocDto[] = [];
        for (const postId of postIds) {
            const data = await this.postModel.findById(postId);
            if (!data)
                continue;
            const post = new PostDocDto(data);
            if (topic === undefined || post.isRelevantTopic(topic)) {
                res.push(post);
                if (res.length >= limit) {
                    break;
                }
            }
        }
        return res;
    }
}

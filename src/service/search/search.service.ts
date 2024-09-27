import { Injectable, Logger } from '@nestjs/common';
import * as natural from 'natural';
import { CacheService } from '../cache/cache.service';
import { PostSummary } from '../../entity/PostSummary';
import { PostMateData } from '../../entity/PostMateData';
import { TfIdfBuildHelper } from '../../utils/tfidf-builder-helper';
import { PostsDBName, PostSummaryCollectionName } from '../../utils/ConstantValue';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
    private _tfidfData: {
        tfidfMap?: Map<string, natural.TfIdf>;
        building: boolean;
        expireAt?: Date
    } = {
        building: false
    };

    getTfidf(topic:string = 'all'): natural.TfIdf {
        if (this._tfidfData.building) {
            throw new TfIdfBuildingException();
        }
        else if (!this._tfidfData.tfidfMap || this._tfidfData.expireAt < new Date()) {
            this.setupTfidfCache();
            throw new TfIdfBuildingException();
        }

        return this._tfidfData.tfidfMap.get(topic) ?? new natural.TfIdf();
    }

    private get tfidfMap(): Map<string, natural.TfIdf> {
        return this._tfidfData.tfidfMap;
    }

    private set tfidfMap(value: Map<string, natural.TfIdf>) {
        this._tfidfData.tfidfMap = value;
        this._tfidfData.expireAt = new Date(Date.now() + (parseInt(process.env.TFIDF_CACHE_TTL) * 1000));
    }

    private get building(): boolean {
        return this._tfidfData.building;
    }

    private set building(value: boolean) {
        this._tfidfData.building = value;
    }

    constructor(
        @InjectRepository(PostSummary, "posts") private postSummaryRepository: Repository<PostSummary>,
        @InjectRepository(PostMateData, "posts") private postMateDataRepository: Repository<PostMateData>,
        private readonly cacheService: CacheService
    ) {
        this.setupTfidfCache();
    }

    private async setupTfidfCache() {
        console.log('Setting up tfidf cache');
        let documentCount = 0;
        const startTime = performance.now();

        Logger.log('Setting up tfidf cache', "SearchService");
        this.building = true;

        const tfidfMap = new Map();

        const totalDocuments = await this.postMateDataRepository.count();
        const numWorkers = parseInt(process.env.TFIDF_WORKER_NUM ?? '1');
        const batchSize:number = Math.ceil(totalDocuments / numWorkers);
        
        Logger.log(`Setting up tfidf in ${numWorkers} thread`, "SearchService");
        const workerPromises = [];
        for (let i = 0; i < numWorkers; i++){
            const skip = i * batchSize;
            workerPromises.push(
                new Promise((resolve, reject) => {
                    const getOrCreateTopicTfidf = (topic: string): natural.TfIdf =>  {
                        if (!tfidfMap.has(topic)) {
                            tfidfMap.set(topic, new natural.TfIdf());
                        }
                        return tfidfMap.get(topic);
                    };
                    const worker = TfIdfBuildHelper.getWorker(
                        {
                            skip,
                            limit: batchSize + skip > totalDocuments ? totalDocuments - skip : batchSize,
                            postConnectionUri: process.env.DATABASE_URL,
                            dbName: PostsDBName,
                            collectionName: PostSummaryCollectionName
                        }
                    );
    
                    worker.on('message', (message) => {
                        Logger.log(`Worker ${i + 1}: send  ${message.documents.length} document`, "SearchService");
                        for (const post of message.documents) {
                            if (post.selftext === undefined) {
                                documentCount -= 1;
                                continue;
                            }

                            
                            getOrCreateTopicTfidf(post.topic_1).addDocument(post.selftext, post._id);
                            getOrCreateTopicTfidf(post.topic_2).addDocument(post.selftext, post._id);
                            getOrCreateTopicTfidf(post.topic_3).addDocument(post.selftext, post._id);
                            getOrCreateTopicTfidf(post.topic_4).addDocument(post.selftext, post._id);
                            getOrCreateTopicTfidf('all').addDocument(post.selftext, post._id);
                        }
                        documentCount += message.documents.length;
                    });

                    worker.on('error', (err) => {
                        Logger.error(`Worker ${i + 1} encountered an error: ${err}`, "SearchService");
                        reject(err);
                    });
            
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                        Logger.log(`Worker ${i + 1} exited with ${code}`, "SearchService");
                        resolve(`Worker ${i + 1} finished`);
                    });
                })
            );                
        }
        
        Promise.all(workerPromises).then(() => {
            this.tfidfMap = tfidfMap;
            this.building = false;
            Logger.log(`Tfidf cache setup complete ${documentCount} doucuments and ${this.tfidfMap.size} topics with ${numWorkers}  thread in ${performance.now() - startTime} ms`, "SearchService");
        }).catch((err) => {
            Logger.error(`Workers encountered an error: ${err}`, "SearchService");
            this.building = false;
        });
    }

    async search(topic:string = 'all', query: string, limit: number = 10): Promise<PostSummary[]> {
        const similerList = [];

        this.getTfidf(topic).tfidfs(query, (i, measure) => {
            if (measure === 0) return;
            similerList.push({ id: this.getTfidf(topic).documents[i], measure });
        });

        // Sort by measure
        similerList.sort((a, b) => b.measure - a.measure);
        const postIds = similerList.map(result => {
            return result.id.__key;
        });

        const res: PostSummary[] = [];
        for (const postId of postIds) {
            const post = await this.postSummaryRepository.findOne(postId);
            if (!post)
                continue;
            if (topic === undefined || topic == 'all' || post.topics.includes(topic)) {
                res.push(post);
                if (res.length >= limit) {
                    break;
                }
            }
        }
        return res;
    }
}

export class TfIdfBuildingException extends Error {
    constructor() {
        super('Server is still building tfidf cache, please waiting');
    }
}

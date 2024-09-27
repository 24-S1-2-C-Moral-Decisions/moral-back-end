import { Injectable, Logger } from '@nestjs/common';
import * as natural from 'natural';
import { CacheService } from '../cache/cache.service';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { PostDocDto } from '../../module/posts/post.dto';
import { PostDoc } from '../../schemas/post.shcemas';
import { TfIdfBuildHelper } from '../../utils/tfidf-builder-helper';

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
        @InjectModel(PostDoc.name, 'posts') private postModel: Model<PostDoc>,
        @InjectConnection('posts') private readonly poetConnection: Connection,
        private readonly cacheService: CacheService
    ) {
        this.setupTfidfCache();
    }

    async setupTfidfCache() {
        let documentCount = 0;
        const startTime = performance.now();

        Logger.log('Setting up tfidf cache', "SearchService");
        this.building = true;

        const tfidfMap = new Map();

        const totalDocuments = await this.poetConnection.collection('all').countDocuments();
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
                            limit: batchSize,
                            postConnectionUri: process.env.DATABASE_URL,
                            dbName: 'posts',
                            collectionName: 'all'
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
                            getOrCreateTopicTfidf(post.topic_3).addDocument(post.selftext, post._id);
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

    async search(topic:string = 'all', query: string, limit: number = 10): Promise<PostDocDto[]> {
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

        const res: PostDocDto[] = [];
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

export class TfIdfBuildingException extends Error {
    constructor() {
        super('Server is still building tfidf cache, please waiting');
    }
}

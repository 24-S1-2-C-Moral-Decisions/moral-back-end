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
        tfidf?: natural.TfIdf;
        building: boolean;
        expireAt?: Date
    } = {
        building: false
    };

    private get tfidf(): natural.TfIdf {
        if (this._tfidfData.building) {
            throw new TfIdfBuildingException();
        }
        else if (!this._tfidfData.tfidf || this._tfidfData.expireAt < new Date()) {
            this.setupTfidfCache();
            throw new TfIdfBuildingException();
        }
        return this._tfidfData.tfidf;
    }

    private set tfidf(value: natural.TfIdf) {
        this._tfidfData.tfidf = value;
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
        let startTime = performance.now();

        Logger.log('Setting up tfidf cache', "SearchService");
        this.building = true;

        this.tfidf = new natural.TfIdf();

        const totalDocuments = await this.poetConnection.collection('all').countDocuments();
        const numWorkers = parseInt(process.env.TFIDF_WORKER_NUM ?? '1');
        const batchSize:number = Math.ceil(totalDocuments / numWorkers);
        
        Logger.log(`Setting up tfidf in ${numWorkers} thread`, "SearchService");
        const workerPromises = [];
        for (let i = 0; i < numWorkers; i++){
            const skip = i * batchSize;
            workerPromises.push(
                new Promise((resolve, reject) => {
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
                            this.tfidf.addDocument(post.selftext, post._id);
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
        
        // 等待所有 Worker 完成任务
        Promise.all(workerPromises).then(() => {
            this.building = false;
            Logger.log(`Tfidf cache setup complete in ${performance.now() - startTime} ms`, "SearchService");
        });
    }

    async search(topic:string, query: string, limit: number = 10): Promise<PostDocDto[]> {
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

export class TfIdfBuildingException extends Error {
    constructor() {
        super('Server is still building tfidf cache, please waiting');
    }
}

import { MigrationInterface } from "typeorm";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { PostSummary } from "../../entity/PostSummary";
import { PostSummaryBuildHelper } from "../../utils/posts-summery-builder-helper";
import { profile } from "console";
import { AllCollectionName, PostsDBName, PostSummaryCollectionName, RedditDBName, SubmissionCollectionName } from "../../utils/ConstantValue";

export class AddPostSummaryView1727411954607 implements MigrationInterface {


    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const postsDb = queryRunner.databaseConnection.db(PostsDBName);
        const totalDocuments = await postsDb.collection(AllCollectionName).countDocuments();
        const numWorkers = parseInt(process.env.MIGRATION_WORKER_NUM ?? '1');
        const batchSize:number = Math.ceil(totalDocuments / numWorkers);
        
        console.log(`Setting up PostSummary in ${numWorkers} thread`);
        const startTime = performance.now();

        const workerPromises = [];
        let documentCount = 0;
        for (let i = 0; i < numWorkers; i++){
            const skip = i * batchSize;
            workerPromises.push(
                new Promise((resolve, reject) => {
                    const worker = PostSummaryBuildHelper.getWorker(
                        {
                            workerId: i,
                            connectionUri: process.env.DATABASE_URL,
                            postsDbName: PostsDBName,
                            redditDbName: RedditDBName,
                            allCollectionName: AllCollectionName,
                            postSummaryCollectionName: PostSummaryCollectionName,
                            submissionCollectionName: SubmissionCollectionName,
                            skip,
                            batchSize: batchSize + skip > totalDocuments ? totalDocuments - skip : batchSize
                        }
                    );

                    worker.on('message', (message) => {
                        console.log(`Worker ${i + 1}: process ${message.insertedCount} document`);
                        documentCount += message.insertedCount;
                        resolve("success");
                    });

                    worker.on('error', (error) => {
                        console.error(`Worker ${i + 1}: error`);
                        console.error(error);
                        reject();
                    });
                })
            );
        }

        await Promise.all(workerPromises)
        console.log(`PostSummary setup complete ${documentCount} documents in ${performance.now() - startTime} ms`);
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        await queryRunner.databaseConnection.db(PostsDBName).dropCollection(PostSummaryCollectionName);
    }

}

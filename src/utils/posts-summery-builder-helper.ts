import { Worker } from 'worker_threads';

export class PostSummaryBuildHelper {
    static getWorker(workerData: {
        workerId: number,
        connectionUri: string
        postsDbName: string,
        redditDbName: string,
        allCollectionName: string,
        postSummaryCollectionName: string,
        submissionCollectionName: string,
        skip: number,
        batchSize: number,
    }) {
        return new Worker(
            "./src/utils/posts-summery-builder.js",
            {
                workerData,
                // execArgv: ['--unhandled-rejections=strict' ]
            }
        );
    }
}
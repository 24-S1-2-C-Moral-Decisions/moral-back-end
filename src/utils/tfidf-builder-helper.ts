import { Worker } from 'worker_threads';

export class TfIdfBuildHelper {
    
    static getWorker(workerData: {
        skip: number,
        limit: number,
        postConnectionUri: string
        dbName: string,
        collectionName: string
    }) {
        return new Worker(
            "./src/utils/tfidf-builder.js",
            {
                workerData,
                execArgv: ['--unhandled-rejections=strict' ]
            }
        );
    }
}
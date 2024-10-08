const { parentPort, workerData } = require('worker_threads');
const { MongoClient } = require('mongodb');

// main
(async () => {
    const client = new MongoClient(workerData.postConnectionUri);
    try {
        // connect to database
        await client.connect();
        const database = client.db(workerData.dbName);
        const collection = database.collection(workerData.collectionName);

        // query database
        // console.log(`Worker: skip ${workerData.skip}, limit ${workerData.limit}`);

        let documentCount = 0;
        let documentList = [];
        for await (const post of collection.find().skip(workerData.skip).limit(workerData.limit)) {
            documentList.push(post);
            documentCount++;
            if (documentCount % process.env.TFIDF_WORKER_BATCH_SIZE == 0) {
                parentPort?.postMessage({
                    documents: documentList,
                });
                documentList = [];
            }
        }
        // send the remaining documents
        parentPort?.postMessage({
            documents: documentList,
        });
    } finally {
        // 关闭 MongoDB 连接
        await client.close();
    }

    parentPort?.close();
})();


const { parentPort, workerData } = require('worker_threads');
const { MongoClient } = require('mongodb');

// main
(async () => {
    const client = new MongoClient(workerData.connectionUri);
    try {
        // connect to database
        await client.connect();
        const postDb = client.db(workerData.postsDbName);
        const redditDb = client.db(workerData.redditDbName);
        const allCollection = postDb.collection(workerData.allCollectionName);
        const postSummaryCollection = postDb.collection(workerData.postSummaryCollectionName);
        const submissionCollection = redditDb.collection(workerData.submissionCollectionName);

        await postSummaryCollection.createIndex({id: 1}, {unique: true});

        let summaryList = [];
        let insertedCount = 0;
        const batchSize = 200;
        for (let i = 0; i < workerData.batchSize; i+= batchSize) {
            for await (const post of allCollection.find().skip(workerData.skip + i).limit(i + batchSize  > workerData.batchSize ? workerData.batchSize - i : batchSize )) {
                const submission = await submissionCollection.findOne({_id: post._id});
                const postSummary = {
                    id: post._id,
                    title: post.title,
                    verdict: post.verdict,
                    YTA: post.YTA,
                    NTA: post.NTA,
                    selftext: submission.selftext,
                    topics: []
                }
    
                // add all topics to the postSummary, it is post.topic_* fields
                for (const key in post) {
                    if (key.startsWith('topic_') && !key.endsWith('_p')) {
                        postSummary.topics.push(post[key]);
                    }
                }
                summaryList.push(postSummary);
            }
            await postSummaryCollection.insertMany(summaryList);
            insertedCount += summaryList.length;
            summaryList = [];
            console.log(`Worker ${workerData.workerId} is processing ${insertedCount} / ${workerData.batchSize} documents`);
        }
        
        // send the remaining documents
        parentPort?.postMessage({
            insertedCount
        });

    } finally {
        await client.close();
    }
    parentPort?.close();
})();


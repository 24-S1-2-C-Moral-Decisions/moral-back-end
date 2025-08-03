const { parentPort, workerData } = require("worker_threads");
const { MongoClient } = require("mongodb");

// main
(async () => {
  const client = new MongoClient(workerData.connectionUri);
  try {
    // connect to database
    await client.connect();
    const postDb = client.db(workerData.postsDbName);
    const redditDb = client.db(workerData.redditDbName);
    const allCollection = postDb.collection(workerData.allCollectionName);
    const postSummaryCollection = postDb.collection(
      workerData.postSummaryCollectionName
    );
    const submissionCollection = redditDb.collection(
      workerData.submissionCollectionName
    );

    await postSummaryCollection.createIndex({ id: 1 }, { unique: true });

    let summaryList = [];
    let insertedCount = 0;
    const batchSize = 200;
    const totalToProcess = Math.min(workerData.batchSize, 25750); // 限制最大处理数量

    for (let i = 0; i < totalToProcess; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalToProcess - i);
      for await (const post of allCollection
        .find()
        .skip(workerData.skip + i)
        .limit(currentBatchSize)) {
        const submission = await submissionCollection.findOne({
          _id: post._id,
        });
        const postSummary = {
          id: post._id,
          title: post.title,
          verdict: post.verdict,
          YTA: post.YTA,
          NTA: post.NTA,
          selftext: submission?.selftext || "",
          commentCount: submission?.num_comments || 0,
          topics: [],
        };

        // add all topics to the postSummary, it is post.topic_* fields
        for (const key in post) {
          if (key.startsWith("topic_") && !key.endsWith("_p")) {
            postSummary.topics.push(post[key]);
          }
        }
        summaryList.push(postSummary);
      }
      // 使用upsert避免重复键错误
      for (const summary of summaryList) {
        await postSummaryCollection.updateOne(
          { id: summary.id },
          { $set: summary },
          { upsert: true }
        );
      }
      insertedCount += summaryList.length;
      summaryList = [];
      console.log(
        `Worker ${workerData.workerId} is processing ${insertedCount} / ${totalToProcess} documents`
      );
    }

    // send the remaining documents
    parentPort?.postMessage({
      insertedCount,
    });
  } finally {
    await client.close();
  }
  parentPort?.close();
})();

const { MongoClient, ObjectId } = require("mongodb");
const { workerData, parentPort } = require("worker_threads");

(async () => {
  const client = new MongoClient(workerData.connectionUri);
  let insertedCount = 0;

  try {
    await client.connect();
    const postDb = client.db(workerData.postsDbName);
    const surveyDb = client.db(workerData.surveyDbName);

    const sourceCollection = postDb.collection("posts");
    const targetCollection = surveyDb.collection("posts");

    await targetCollection.createIndex({ _id: 1 }, { unique: true });

    const BATCH_SIZE = 100;
    for (let i = 0; i < workerData.batchSize; i += BATCH_SIZE) {
      const limit = Math.min(BATCH_SIZE, workerData.batchSize - i);
      const docs = await sourceCollection.find().skip(workerData.skip + i).limit(limit).toArray();

      const transformed = docs.map(post => ({
        _id: post._id,
        title: post.title || "",
        selftext: post.selftext || "",
        very_certain_YA: post.very_certain_YA || 0,
        very_certain_NA: post.very_certain_NA || 0,
        YA_percentage: post.YA_percentage || 0,
        NA_percentage: post.NA_percentage || 0,
        original_post_YA_top_reasonings: post.original_post_YA_top_reasonings || [],
        original_post_NA_top_reasonings: post.original_post_NA_top_reasonings || [],
        count: post.count || [0, 0, 0, 0, 0],
      }));

      if (transformed.length > 0) {
        const bulkOps = transformed.map(doc => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $setOnInsert: doc },
            upsert: true
          }
        }));

        const result = await targetCollection.bulkWrite(bulkOps, {
          ordered: false,
          writeConcern: { w: 1 },
          maxTimeMS: 30000
        });

        insertedCount += result.upsertedCount;
      }
    }

    parentPort?.postMessage({ insertedCount });
  } catch (err) {
    console.error(`Worker ${workerData.workerId} failed:`, err);
    throw err;
  } finally {
    await client.close();
    parentPort?.close();
  }
})();

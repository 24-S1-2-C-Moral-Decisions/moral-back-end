const { MongoClient, ObjectId } = require("mongodb");
const { workerData, parentPort } = require("worker_threads");

(async () => {
  const client = new MongoClient(workerData.connectionUri);
  let insertedCount = 0;

  try {
    await client.connect();
    const postDb = client.db(workerData.postsDbName);
    const surveyDb = client.db(workerData.surveyDbName);

    const sourceCollection = postDb.collection("all");
    const targetCollection = surveyDb.collection("posts");

    const BATCH_SIZE = 100;
    for (let i = 0; i < workerData.batchSize; i += BATCH_SIZE) {
      const limit = Math.min(BATCH_SIZE, workerData.batchSize - i);
      const docs = await sourceCollection
        .find()
        .skip(workerData.skip + i)
        .limit(limit)
        .toArray();

      const transformed = docs.map((post) => ({
        _id: post._id,
        title: post.title || "",
        selftext: post.selftext || "",
        // 这些字段在原始数据中不存在，设置为默认值
        very_certain_YA: 0,
        very_certain_NA: 0,
        YA_percentage: 0,
        NA_percentage: 0,
        original_post_YA_top_reasonings: [],
        original_post_NA_top_reasonings: [],
        count: [0, 0, 0, 0, 0],
        // 添加原始数据中的有用字段
        verdict: post.verdict || "",
        YTA: post.YTA || 0,
        NTA: post.NTA || 0,
        ESH: post.ESH || 0,
        NAH: post.NAH || 0,
        INFO: post.INFO || 0,
        num_comments: post.num_comments || 0,
        score: post.score || 0,
        year: post.year || 0,
        month: post.month || 0,
        day: post.day || 0,
        topic_1: post.topic_1 || "",
        topic_2: post.topic_2 || "",
        topic_3: post.topic_3 || "",
        topic_4: post.topic_4 || "",
      }));

      if (transformed.length > 0) {
        const bulkOps = transformed.map((doc) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $setOnInsert: doc },
            upsert: true,
          },
        }));

        const result = await targetCollection.bulkWrite(bulkOps, {
          ordered: false,
          writeConcern: { w: 1 },
          maxTimeMS: 30000,
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

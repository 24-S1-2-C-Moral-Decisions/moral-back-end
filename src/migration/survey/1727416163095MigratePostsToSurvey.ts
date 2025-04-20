import { MigrationInterface } from "typeorm";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { Worker } from "worker_threads";
import { PostsDBName, SurveyDBName } from "../../utils/ConstantValue";

export class MigratePostsToSurvey1727416163095 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const postDb = queryRunner.databaseConnection.db(PostsDBName);
    const totalDocuments = await postDb.collection("posts").countDocuments();

    const numWorkers = parseInt(process.env.MIGRATION_WORKER_NUM ?? '8');
    const batchSize = Math.ceil(totalDocuments / numWorkers);

    const startTime = performance.now();
    let totalInserted = 0;

    const workerPromises = [];
    for (let i = 0; i < numWorkers; i++) {
      const skip = i * batchSize;
      const currentBatch = Math.min(batchSize, totalDocuments - skip);

      workerPromises.push(
        new Promise((resolve, reject) => {
          const worker = new Worker('./src/utils/posts-to-survey-worker.js', {
            workerData: {
              workerId: i,
              connectionUri: process.env.DATABASE_URL,
              postsDbName: PostsDBName,
              surveyDbName: SurveyDBName,
              skip,
              batchSize: currentBatch,
            },
          });

          worker.on('message', (message) => {
            console.log(`Worker ${i + 1}: inserted ${message.insertedCount} / ${batchSize} docs`);
            totalInserted += message.insertedCount;
            resolve(null);
          });

          worker.on('error', (err) => {
            console.error(`Worker ${i + 1} failed`, err);
            reject(err);
          });
        })
      );
    }

    await Promise.all(workerPromises);
    console.log(`✅ Done. Inserted ${totalInserted} documents in ${performance.now() - startTime} ms`);
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.databaseConnection.db(SurveyDBName).dropCollection("posts");
    console.log("🧹 Dropped survey.posts collection");
  }
}

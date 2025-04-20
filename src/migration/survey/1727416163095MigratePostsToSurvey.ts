import { MigrationInterface, ObjectId } from "typeorm";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { PostsDBName, SurveyDBName } from "../../utils/ConstantValue";
import { Logger } from "@nestjs/common";
import { Collection, Db, BulkWriteResult, Document as DocumentMongo } from "mongodb";

export class MigratePostsToSurvey1727411111111 implements MigrationInterface {
  private readonly logger = new Logger(this.constructor.name);
  private readonly BATCH_SIZE = 100; // 每批处理文档数
  private readonly RETRY_LIMIT = 3; // 最大重试次数
  private readonly BULK_WRITE_TIMEOUT = 30000; // 批量写入超时时间(ms)

  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const postDb = queryRunner.databaseConnection.db(PostsDBName);
    const surveyDb = queryRunner.databaseConnection.db(SurveyDBName);
  
    const sourceCollection: Collection<DocumentMongo> = postDb.collection("posts") as unknown as Collection<DocumentMongo>;
    const targetCollection: Collection<DocumentMongo> = surveyDb.collection("posts") as unknown as Collection<DocumentMongo>;
  
    await this.createIndexIfNotExists(targetCollection);

    let totalProcessed = 0;
    let totalInserted = 0;
    let batchCount = 0;
    let lastId: ObjectId | null = null;

    try {
      let hasMoreData = true;
      while (hasMoreData) {
        batchCount++;
        const result = await this.processBatch(
          sourceCollection, 
          targetCollection, 
          lastId
        );

        totalInserted += result.insertedCount;
        totalProcessed += result.processedCount;
        lastId = result.lastProcessedId;
        hasMoreData = result.lastProcessedId !== null;

        this.logger.log(
          `Batch ${batchCount}: Processed ${result.processedCount} docs (Inserted ${result.insertedCount}) | ` +
          `Total: ${totalProcessed} processed, ${totalInserted} inserted`
        );
      }

      this.logger.log(`✅ Migration completed. Total inserted: ${totalInserted}`);
    } catch (error) {
      this.logger.error(`❌ Migration failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private async processBatch(
    sourceCollection: Collection<DocumentMongo>,
    targetCollection: Collection<DocumentMongo>,
    lastId: ObjectId
  ): Promise<{ insertedCount: number; processedCount: number; lastProcessedId: ObjectId }> {
    let retries = 0;
    let lastError: unknown;

    while (retries < this.RETRY_LIMIT) {
      try {
        const query = lastId ? { _id: { $gt: lastId } } : {};
        const batch = await sourceCollection
          .find(query)
          .sort({ _id: 1 })
          .limit(this.BATCH_SIZE)
          .toArray();

        if (batch.length === 0) {
          return { 
            insertedCount: 0, 
            processedCount: 0, 
            lastProcessedId: null 
          };
        }

        const transformedDocs = batch.map(post => ({
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

        const bulkOps = transformedDocs.map(doc => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $setOnInsert: doc },
            upsert: true
          }
        }));

        const result = await targetCollection.bulkWrite(bulkOps, {
          ordered: false,
          writeConcern: { w: 1 },
          maxTimeMS: this.BULK_WRITE_TIMEOUT
        });

        return {
          insertedCount: result.upsertedCount,
          processedCount: batch.length,
          lastProcessedId: batch[batch.length - 1]._id
        };

      } catch (error) {
        lastError = error;
        retries++;
        this.logger.warn(
          `Batch processing failed (attempt ${retries}/${this.RETRY_LIMIT}): ${error instanceof Error ? error.message : String(error)}`
        );
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  private async createIndexIfNotExists(collection: Collection<DocumentMongo>): Promise<void> {
    try {
      const indexes = await collection.indexes();
      const hasIdIndex = indexes.some(idx => idx.key && '_id' in idx.key && idx.key._id === 1);
      
      if (!hasIdIndex) {
        await collection.createIndex({ _id: 1 }, { unique: true });
        this.logger.log("Created _id index on target collection");
      }
    } catch (error) {
      this.logger.warn(`Failed to create index: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    try {
      await queryRunner.databaseConnection.db(SurveyDBName).dropCollection("posts");
      this.logger.log("🧹 Rolled back migration, dropped survey.posts collection");
    } catch (error) {
      this.logger.error(`Rollback failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

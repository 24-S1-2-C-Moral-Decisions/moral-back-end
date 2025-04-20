import { MigrationInterface, ObjectId } from "typeorm";
import { PostsDBName, SurveyDBName } from "../../utils/ConstantValue";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { Collection, Db } from "mongodb";
import { Logger } from "@nestjs/common";

export class AddCountColumnForQuestion1727316163095 implements MigrationInterface {
  private readonly logger = new Logger(this.constructor.name);
  private readonly BATCH_SIZE = 1000;

  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const postsDb = queryRunner.databaseConnection.db(PostsDBName);
    const postsCollection = postsDb.collection("posts");

    // 调试信息改用 Logger
    this.logger.log(`操作数据库: ${postsDb.databaseName}`);
    this.logger.debug(`集合列表: ${JSON.stringify(await postsDb.listCollections().toArray())}`);

    const sampleDoc = await postsCollection.findOne({});
    this.logger.debug(`样例文档: ${JSON.stringify(sampleDoc)}`);

    let lastId: ObjectId | null = null;
    let hasMoreData = true;

    while (hasMoreData) {
      const filter = lastId ? { _id: { $gt: lastId } } : {};

      const docs = await postsCollection
        .find(filter)
        .sort({ _id: 1 })
        .limit(this.BATCH_SIZE)
        .toArray();

      if (docs.length === 0) {
        hasMoreData = false;
        continue;
      }

      const updateResult = await postsCollection.updateMany(
        { _id: { $in: docs.map(d => d._id) } },
        { $set: { count: [0, 0, 0, 0, 0] } },
        { maxTimeMS: 60000 }
      );

      lastId = docs[docs.length - 1]._id;
      this.logger.log(`已处理 ${docs.length} 条文档，最后ID: ${lastId}`);
      this.logger.debug(`更新结果: ${JSON.stringify(updateResult)}`);
    }

    const updatedDoc = await postsCollection.findOne({});
    this.logger.debug(`更新后样例: ${JSON.stringify(updatedDoc)}`);
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    const surveyDb = queryRunner.databaseConnection.db(SurveyDBName);
    const postsCollection = surveyDb.collection("posts");

    const docsWithCount = await postsCollection
      .find({ count: { $exists: true } })
      .toArray();

    for (const [index, post] of docsWithCount.entries()) {
      const updateResult = await postsCollection.updateOne(
        { _id: post._id },
        { $unset: { count: "" } }
      );
      
      if (index % 100 === 0) {
        this.logger.log(`已回滚 ${index + 1}/${docsWithCount.length} 条文档`);
      }
      this.logger.debug(`回滚结果: ${JSON.stringify(updateResult)}`);
    }

    this.logger.log(`✅ 已完成回滚，共处理 ${docsWithCount.length} 条文档`);
  }
}

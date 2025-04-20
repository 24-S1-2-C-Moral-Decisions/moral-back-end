import { MigrationInterface, QueryRunner } from "typeorm";
import { PostConnectionName, PostsDBName, SurveyDBName } from "../../utils/ConstantValue";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";

export class AddCountColumnForQuestion1727316163095 implements MigrationInterface {

    // public async up(queryRunner: QueryRunner): Promise<void> {
    //     const result = await queryRunner.connection.mongoManager.updateMany(
    //         PostConnectionName,
    //         {},
    //         [
    //             {
    //                 $set: {
    //                     count: [0, 0, 0, 0, 0],
    //                 },
    //             }
    //         ]
    //     )
    //     Logger.log(`更新结果: ${JSON.stringify(result)}`);
    // }
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const postsDb = queryRunner.databaseConnection.db(PostsDBName);

        // 调试：打印当前数据库和集合信息
        console.log("操作数据库:", postsDb.databaseName);
        console.log("集合列表:", await postsDb.listCollections().toArray());

        // 检查文档数量和样例
        const sampleDoc = await postsDb.collection("posts").findOne({});
        console.log("样例文档:", sampleDoc);

        // 执行更新
        // const result = await postsDb.collection("posts").updateMany(
        //   {}, 
        //   { $set: { count: [0,0,0,0,0] } }
        // );
        // console.log("更新结果:", result);
        const BATCH_SIZE = 1000;
        let lastId = null;

        while (true) {
            const filter = lastId ? { _id: { $gt: lastId } } : {};

            const docs = await postsDb.collection("posts")
                .find(filter)
                .sort({ _id: 1 })
                .limit(BATCH_SIZE)
                .toArray();

            if (docs.length === 0) break;

            await postsDb.collection("posts").updateMany(
                { _id: { $in: docs.map(d => d._id) } },
                { $set: { count: [0, 0, 0, 0, 0] } },
                { maxTimeMS: 60000 }
            );

            lastId = docs[docs.length - 1]._id;
            console.log(`已处理 ${docs.length} 条文档，最后ID: ${lastId}`);
        }

        // 验证更新
        const updatedDoc = await postsDb.collection("posts").findOne({});
        console.log("更新后样例:", updatedDoc);
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const surveyDB = queryRunner.databaseConnection.db(SurveyDBName);
        const posts = surveyDB.collection("posts");
        const sourcePosts = await posts.find({ count: { $exists: true } }).toArray();

        for (const post of sourcePosts) {
            await posts.updateOne(
                { _id: post._id },
                { $unset: { count: "" } }
            );
        }
        
        // await queryRunner.connection.mongoManager.updateMany(
        //     PostConnectionName,
        //     {},
        //     [
        //         {
        //             $unset: "count",
        //         },
        //     ]
        // )
    }

}

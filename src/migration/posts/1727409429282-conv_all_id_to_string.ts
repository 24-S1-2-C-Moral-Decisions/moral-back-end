import { MigrationInterface } from "typeorm";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { AllCollectionName, PostsDBName } from "../../utils/ConstantValue";


export class ConvID1727409429282 implements MigrationInterface {

    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const postsDb = queryRunner.databaseConnection.db(PostsDBName);
        const collection = postsDb.collection(AllCollectionName)
        const count = await collection.count({ _id: { $not: { $type: "string" } } })
        
        for (let index = 0; index < count; index++) {
            const obj = await collection.findOneAndDelete({ _id: { $not: { $type: "string" } } })
                        .then((data)=>{
                            return data.value
                        })
            const str = obj._id.toString()
            delete obj._id
            const newObj = {
                _id: str == "3215000000000" ? "3215e9" : str,
                ...obj
            }
            await collection.insertOne(newObj)
        }
        console.log("Process " + count + " documents")
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        queryRunner.databaseConnection.db(PostsDBName)
    }

}

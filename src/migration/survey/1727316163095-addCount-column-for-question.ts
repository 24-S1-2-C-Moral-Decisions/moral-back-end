import { MigrationInterface, QueryRunner } from "typeorm";
import { PostConnectionName } from "../../utils/ConstantValue";

export class AddCountColumnForQuestion1727316163095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.mongoManager.updateMany(
            PostConnectionName, 
            {}, 
            [
                {
                    $set: {
                      count: [0,0,0,0,0],
                    },
                }
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.mongoManager.updateMany(
            PostConnectionName, 
            {}, 
            [
                {
                    $unset: "count",
                },
            ]
        )
    }

}

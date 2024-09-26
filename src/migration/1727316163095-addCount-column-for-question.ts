import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountColumnForQuestion1727316163095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.mongoManager.updateMany(
            'posts', 
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
            'posts', 
            {}, 
            [
                {
                    $unset: "count",
                },
            ]
        )
    }

}

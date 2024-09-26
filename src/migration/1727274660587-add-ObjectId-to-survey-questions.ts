import { ObjectId } from "mongodb";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObjectIdToSurveyQuestions1727274660587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.connection.mongoManager.updateMany(
        //     'posts', 
        //     {}, 
        //     [
        //         {
        //             $set: {
        //               id: new ObjectId(),
        //             },
        //         }
        //     ]
        // );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.connection.mongoManager.updateMany(
        //     'posts', 
        //     {}, 
        //     [
        //         {
        //             $unset: "id",
        //         },
        //     ]
        // );
    }

}

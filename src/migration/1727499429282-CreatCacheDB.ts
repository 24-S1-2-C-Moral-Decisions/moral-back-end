import { MigrationInterface, QueryRunner } from "typeorm";
import { CacheDBName } from "../utils/ConstantValue";

export class CreatCacheDB1727499429282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createDatabase(CacheDBName, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase(CacheDBName);
    }

}

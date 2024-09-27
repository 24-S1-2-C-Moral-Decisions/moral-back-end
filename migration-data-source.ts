import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { DatabaseType, SurveyConnectionName, SurveyDBName } from "./src/utils/ConstantValue";

dotenv.config({ path: __dirname + '/.env/.env' });
export const AppDataSource = new DataSource({
    type: DatabaseType,
    url: process.env.DATABASE_URL,
    database: SurveyDBName,
    name: SurveyConnectionName,
    logging: true,
    entities: [__dirname + "/src/entity/*.ts"],
    migrations: [__dirname + "/src/migration/**/*.ts"],
    migrationsTableName: "migrations"
  });

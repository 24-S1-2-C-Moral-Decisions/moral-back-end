import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { DatabaseType, PostConnectionName, PostsDBName } from "./src/utils/ConstantValue";

dotenv.config({ path: __dirname + '/migration.env' });
export const AppDataSource = new DataSource({
    type: DatabaseType,
    url: process.env.DATABASE_URL,
    database: PostsDBName,
    name: PostConnectionName,
    logging: true,
    entities: [__dirname + "/src/entity/*.ts"],
    migrations: [__dirname + "/src/migration/**/*.ts"],
    migrationsTableName: "migrations"
  });

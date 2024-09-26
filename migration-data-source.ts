import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/.env/.env' });
export const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.DATABASE_URL,
    database: 'survey',
    name: 'survey',
    logging: true,
    entities: [__dirname + "/src/entity/*.ts"],
    migrations: [__dirname + "/src/migration/*.ts"],
    migrationsTableName: "migrations"
  });

import { join } from 'path'
import { Dialect } from 'sequelize';
import { Sequelize } from "sequelize-typescript";
import { SequelizeTypescriptMigration } from "sequelize-typescript-migration-lts";
import * as credentials from "../tokens/credentials.json"

const bootstrap = async () => {
  const env = process.env.NODE_ENV || 'development';
  const db = credentials[env];

  const sequelize: Sequelize = new Sequelize({
    username: db.username,
    password: db.password,
    database: db.database,
    dialect: (db.dialect as Dialect),
    host: db.host,
    logging: false
  });

  const result = await SequelizeTypescriptMigration.makeMigration(sequelize, {
    outDir: join(__dirname, './migrations'),
    migrationName: "init",
    preview: false,
  });
  console.log(result);
};

bootstrap();



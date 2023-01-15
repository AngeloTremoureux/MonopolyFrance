import path from 'path';

import { Dialect } from 'sequelize';
import { Sequelize } from "sequelize-typescript";
import { SequelizeTypescriptMigration } from "sequelize-typescript-migration-lts";
import * as credentials from "../tokens/credentials.json"

const bootstrap = async () => {
  const env = process.env.NODE_ENV || 'development';
  const db = credentials[env];

  const sequelize: Sequelize = new Sequelize({
    username: db.username,
    password: undefined,
    database: db.database,
    dialect: (db.dialect as Dialect),
    host: db.host,
    logging: false
  });

  console.log("sequelize", sequelize);

  const result = await SequelizeTypescriptMigration.makeMigration(sequelize, {
    outDir: path.join(__dirname, './migrations'),
    migrationName: "init",
    preview: false,
  });
  console.log(result);
};

bootstrap();



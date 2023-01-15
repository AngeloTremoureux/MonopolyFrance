"use strict";
import { cp, readdirSync } from "fs"
import { basename, dirname } from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from 'url';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../tokens/credentials.json')[env];

const db: any = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

async function sync() {
  const files = readdirSync(__dirname + "/models")
    .filter(
      (file) => file.indexOf('.') !== 0
      && file !== "index.ts"
      && file.slice(-3) === '.ts',
    );
    console.log("Files:", files);
  for await (const file of files) {
    const model = await import(`./models/${file}`);
    //const namedModel = model.default(sequelize, DataTypes);
    //console.log("model2:", namedModel)
    db[model.default.name] = model.default;
  }
  console.log("Db loaded")
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      console.log("associate", modelName);
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  console.log("Start sync ...")
  db.sequelize.sync({ force: true })
  console.log("sync ended")
  db.Sequelize = Sequelize;

  console.log("finished")
}
sync();

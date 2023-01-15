"use strict";
import { cp, readdirSync } from "fs";
import { basename, dirname } from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from 'url';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../tokens/credentials.json')[env];

const db: any = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const seq = (async () => {
  const files = readdirSync(__dirname)
    .filter(
      (file) => file.indexOf('.') !== 0
      && file !== basename(__filename)
      && file.slice(-3) === '.ts',
    );
  for await (const file of files) {
    const model = await import(`./${file}`);
    //const namedModel = model.default(sequelize, DataTypes);
    //console.log("model2:", namedModel)
    db[model.default.name] = model.default;
  }
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  //sequelize.sync({force: true});
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
})();

export { Sequelize, sequelize, seq};

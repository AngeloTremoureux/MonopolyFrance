'use strict';
const { Model, BOOLEAN } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bot extends Model {
    static associate(models) {
      Bot.hasOne(models.Board);
    }
  }
  Bot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Bot',
  });
  return Bot;
};
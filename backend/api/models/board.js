'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    static associate(models) {
      Board.belongsTo(models.Game);
      Board.belongsTo(models.Player);
      Board.belongsTo(models.Bot);
      Board.hasOne(models.Position);
    }
  }
  Board.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isReady: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    avatar: DataTypes.INTEGER,
    money: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2000000
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Board',
  });
  return Board;
};
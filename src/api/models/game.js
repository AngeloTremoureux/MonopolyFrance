'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.hasMany(models.Board);
      Game.hasOne(models.Game_Settings);
      Game.hasMany(models.Card);
    }
  }
  Game.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(6),
      unique: true
    },
    isOver: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isStarted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Game'
  });
  return Game;
};
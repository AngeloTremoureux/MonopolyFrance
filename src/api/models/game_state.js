'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameState extends Model {
    static associate(models) {
      GameState.hasMany(models.Game_Settings);
    }
  }
  GameState.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Game_State',
  });
  return GameState;
};
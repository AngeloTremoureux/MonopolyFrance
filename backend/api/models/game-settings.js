'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameSettings extends Model {
    static associate(models) {
      GameSettings.belongsTo(models.Game);
      GameSettings.belongsTo(models.Game_State);
    }
  }
  GameSettings.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    timer: DataTypes.INTEGER,
    playerTurn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nbPlayers: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Game_Settings',
  });
  return GameSettings;
};
'use strict';
const { Model, BOOLEAN } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      Player.hasOne(models.Board);
      Player.hasMany(models.Card);
    }
  }
  Player.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Player',
  });
  return Player;
};
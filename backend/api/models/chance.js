'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chance extends Model {
    static associate(models) {
    }
  }
  Chance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: DataTypes.STRING,
    logo_url: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Chance',
  });
  return Chance;
};
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {
      Position.belongsTo(models.Board);
      Position.belongsTo(models.Card_Settings, {
        foreignKey: {
          name: 'numero',
          defaultValue: 1,
          allowNull: false
        }
      });
    }
  }
  Position.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Position',
  });
  return Position;
};
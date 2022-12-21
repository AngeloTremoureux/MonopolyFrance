'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
      Card.belongsTo(models.Card_Settings);
      Card.belongsTo(models.Game);
      Card.belongsTo(models.Player);
    }
  }
  Card.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    level: DataTypes.INTEGER,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Card',
  });
  return Card;
};
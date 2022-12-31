'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardType extends Model {
    static associate(models) {
      CardType.hasMany(models.Card_Settings);
    }
  }
  CardType.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Card_Type',
  });
  return CardType;
};
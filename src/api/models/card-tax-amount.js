'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardTaxAmount extends Model {
    static associate(models) {
      CardTaxAmount.belongsTo(models.Card_Settings);
    }
  }
  CardTaxAmount.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cost: DataTypes.BIGINT,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Card_Tax_Amount',
  });
  return CardTaxAmount;
};
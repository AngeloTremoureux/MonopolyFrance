'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardPurchasePrize extends Model {
    static associate(models) {
      CardPurchasePrize.belongsTo(models.Card_Settings);
    }
  }
  CardPurchasePrize.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cost: DataTypes.BIGINT,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Card_Purchase_Prize',
  });
  return CardPurchasePrize;
};
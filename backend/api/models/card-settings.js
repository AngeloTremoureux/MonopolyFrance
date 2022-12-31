'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardSettings extends Model {
    static associate(models) {
      CardSettings.belongsTo(models.Card_Type);
      CardSettings.hasOne(models.Card);
      CardSettings.hasMany(models.Card_Purchase_Prize);
      CardSettings.hasMany(models.Card_Tax_Amount);
      CardSettings.hasMany(models.Position, {
        foreignKey: {
          name: 'numero',
          defaultValue: 1,
          allowNull: false
        }
      })
    }
  }
  CardSettings.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    color: DataTypes.INTEGER
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Card_Settings',
  });
  return CardSettings;
};
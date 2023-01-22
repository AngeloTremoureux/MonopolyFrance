import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import Card from './card';
import CardPurchasePrize from './card-purchase-prize';
import CardTaxAmount from './card-tax-amount';
import CardType from './card-type';
import Position from './position';

class CardSettings extends Model<InferAttributes<CardSettings>, InferCreationAttributes<CardSettings>> {
  id!: CreationOptional<number>;
  nom!: string;
  color!: number;
  CardTypeId!: CreationOptional<number>;
  declare Card: NonAttribute<Card>;
  declare Card_Type: NonAttribute<CardType>;
  declare Card_Purchase_Prizes: NonAttribute<CardPurchasePrize[]>;
  declare Card_Tax_Amounts: NonAttribute<CardTaxAmount[]>;
  declare Positions: NonAttribute<Position[]>;
  static associate: (models: any) => void;
}

CardSettings.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING,
  color: DataTypes.INTEGER,
  CardTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardType,
      key: 'id'
    }
  }
}, {
  timestamps: false,
  sequelize,
  modelName: 'Card_Settings',
});

CardSettings.associate = function (models) {
  CardSettings.hasOne(models.Card);
  CardSettings.belongsTo(models.Card_Type);
  CardSettings.hasMany(models.Card_Purchase_Prize);
  CardSettings.hasMany(models.Card_Tax_Amount);
  CardSettings.hasMany(models.Position, {
    foreignKey: {
      name: 'numero',
      defaultValue: 1,
      allowNull: false
    }
  })
};

export default CardSettings;

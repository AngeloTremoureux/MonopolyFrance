import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import CardSettings from './card-settings';

class CardPurchasePrize extends Model<InferAttributes<CardPurchasePrize>, InferCreationAttributes<CardPurchasePrize>> {
  id!: CreationOptional<number>;
  cost!: number;
  cardSettingsId!: CreationOptional<number>;
  static associate: (models: any) => void;
}

CardPurchasePrize.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cost: DataTypes.BIGINT,
  cardSettingsId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardSettings,
      key: 'id'
    }
  }
}, { sequelize });

CardPurchasePrize.associate = function (models) {
  CardPurchasePrize.belongsTo(models.Card_Settings);
};

export default CardPurchasePrize;

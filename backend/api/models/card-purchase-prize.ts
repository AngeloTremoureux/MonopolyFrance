import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class CardPurchasePrize extends Model<InferAttributes<CardPurchasePrize>, InferCreationAttributes<CardPurchasePrize>> {
  id!: CreationOptional<number>;
  cost!: number;
  static associate: (models: any) => void;
}

CardPurchasePrize.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cost: DataTypes.BIGINT,
}, { sequelize });

CardPurchasePrize.associate = function (models) {
  CardPurchasePrize.belongsTo(models.Card_Settings);
};

export default CardPurchasePrize;

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import CardSettings from './card-settings';

class CardPurchasePrize extends Model<InferAttributes<CardPurchasePrize>, InferCreationAttributes<CardPurchasePrize>> {
  id!: CreationOptional<number>;
  cost!: number;
  CardSettingId!: CreationOptional<number>;
  declare CardSettings: NonAttribute<CardSettings[]>;
  static associate: (models: any) => void;
}

CardPurchasePrize.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cost: DataTypes.BIGINT,
  CardSettingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardSettings,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Card_Purchase_Prize',
  timestamps: false
});

CardPurchasePrize.associate = function (models) {
  CardPurchasePrize.belongsTo(models.Card_Settings);
};

export default CardPurchasePrize;

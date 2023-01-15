import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import CardSettings from './card-settings';

class CardTaxAmount extends Model<InferAttributes<CardTaxAmount>, InferCreationAttributes<CardTaxAmount>> {
  id!: CreationOptional<number>;
  cost!: number;
  cardSettingsId!: CreationOptional<number>;
  declare Card_Settings: NonAttribute<CardSettings[]>;
  static associate: (models: any) => void;
}

CardTaxAmount.init({
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
}, {
  timestamps: false,
  sequelize,
  modelName: 'Card_Tax_Amount',
});

CardTaxAmount.associate = function (models) {
  CardTaxAmount.belongsTo(models.Card_Settings);
};

export default CardTaxAmount;

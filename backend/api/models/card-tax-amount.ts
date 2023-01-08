import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class CardTaxAmount extends Model<InferAttributes<CardTaxAmount>, InferCreationAttributes<CardTaxAmount>> {
  id!: CreationOptional<number>;
  cost!: number;
  static associate: (models: any) => void;
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

CardTaxAmount.associate = function (models) {
  CardTaxAmount.belongsTo(models.Card_Settings);
};

export default CardTaxAmount;

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class CardType extends Model<InferAttributes<CardType>, InferCreationAttributes<CardType>> {
  id!: CreationOptional<number>;
  nom!: string;
  static associate: (models: any) => void;
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

CardType.associate = function (models) {
  CardType.hasMany(models.Card_Settings);
};

export default CardType;

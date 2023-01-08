import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Card extends Model<InferAttributes<Card>, InferCreationAttributes<Card>> {
  id!: CreationOptional<number>;
  level!: number;
  static associate: (models: any) => void;
}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  level: DataTypes.INTEGER,
}, {
  timestamps: false,
  sequelize,
  modelName: 'Card',
});

Card.associate = function (models) {
  Card.belongsTo(models.Card_Settings);
  Card.belongsTo(models.Game);
  Card.belongsTo(models.Player);
};

export default Card;

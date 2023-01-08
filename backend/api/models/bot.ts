import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Bot extends Model<InferAttributes<Bot>, InferCreationAttributes<Bot>> {
  id!: CreationOptional<number>;
  username!: string;
  static associate: (models: any) => void;
}

Bot.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: DataTypes.STRING
}, { sequelize });

Bot.associate = function (models) {
  Bot.hasOne(models.Board);
};

export default Bot;

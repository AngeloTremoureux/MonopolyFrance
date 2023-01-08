import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Chance extends Model<InferAttributes<Chance>, InferCreationAttributes<Chance>> {
  id!: CreationOptional<number>;
  message!: string;
  logo_url!: string;
  static associate: (models: any) => void;
}

Chance.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: DataTypes.STRING,
  logo_url: DataTypes.STRING
}, {
  timestamps: false,
  sequelize,
  modelName: 'Chance',
});

export default Chance;

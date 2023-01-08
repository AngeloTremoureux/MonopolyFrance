import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Position extends Model<InferAttributes<Position>, InferCreationAttributes<Position>> {
  id!: CreationOptional<number>;
  static associate: (models: any) => void;
}

Position.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  timestamps: false,
  sequelize,
  modelName: 'Position',
});

Position.associate = function (models) {
  Position.belongsTo(models.Board);
  Position.belongsTo(models.Card_Settings, {
    foreignKey: {
      name: 'numero',
      defaultValue: 1,
      allowNull: false
    }
  });
};

export default Position;

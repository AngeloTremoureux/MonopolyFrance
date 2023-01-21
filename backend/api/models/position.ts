import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import Board from './board';
import CardSettings from './card-settings';

class Position extends Model<InferAttributes<Position>, InferCreationAttributes<Position>> {
  id!: CreationOptional<number>;
  BoardId!: CreationOptional<number>;
  numero!: CreationOptional<number>;
  declare Board: NonAttribute<Board>;
  declare Card_Setting: NonAttribute<CardSettings>;
  static associate: (models: any) => void;
}

Position.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  BoardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Board,
      key: 'id'
    }
  },
  numero: {
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

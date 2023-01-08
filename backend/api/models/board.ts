import { DataTypes, Model, Optional, ModelCtor, ModelStatic, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '.';

class Board extends Model<InferAttributes<Board>, InferCreationAttributes<Board>> {
  id!: CreationOptional<number>;
  isReady!: boolean;
  avatar!: number|null;
  money!: number;
  static associate: (models: any) => void;
}

Board.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  isReady: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  avatar: DataTypes.INTEGER,
  money: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2000000
  }
}, { sequelize });

Board.associate = function (models) {
  Board.belongsTo(models.Game);
  Board.belongsTo(models.Player);
  Board.belongsTo(models.Bot);
  Board.hasOne(models.Position);
};

export default Board;



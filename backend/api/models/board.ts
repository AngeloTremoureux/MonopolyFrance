import { DataTypes, Model, Optional, ModelCtor, ModelStatic, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '.';
import Game from './game';
import Player from './player';

class Board extends Model<InferAttributes<Board>, InferCreationAttributes<Board>> {
  id!: CreationOptional<number>;
  isReady!: boolean;
  avatar!: number|null;
  money!: CreationOptional<number>;
  gameId!: CreationOptional<number>;
  playerId!: CreationOptional<number>;
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
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Game,
      key: 'id'
    }
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Player,
      key: 'id'
    }
  }
}, { sequelize });

Board.associate = function (models) {
  Board.belongsTo(models.Game);
  Board.belongsTo(models.Player);
  Board.hasOne(models.Position);
};

export default Board;



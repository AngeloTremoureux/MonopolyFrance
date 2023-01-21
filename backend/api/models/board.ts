import { DataTypes, Model, Optional, ModelCtor, ModelStatic, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { sequelize } from '.';
import Game from './game';
import Player from './player';
import Position from './position';

class Board extends Model<InferAttributes<Board>, InferCreationAttributes<Board>> {
  id!: CreationOptional<number>;
  isReady!: boolean;
  avatar!: number|null;
  money!: CreationOptional<number>;
  GameId!: CreationOptional<number>;
  PlayerId!: CreationOptional<number>;
  declare Game: NonAttribute<Game>;
  declare Player: NonAttribute<Player>;
  declare Position: NonAttribute<Position>;
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
  GameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Game,
      key: 'id'
    }
  },
  PlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Player,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Board',
});

Board.associate = function (models) {
  Board.belongsTo(models.Game);
  Board.belongsTo(models.Player);
  Board.hasOne(models.Position);
  Board.hasMany(models.Card);
};

export default Board;


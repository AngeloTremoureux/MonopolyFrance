import { CreationOptional, DataTypes, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import Board from './board';
import Player from './player';

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
  id!: CreationOptional<number>;
  code!: string;
  isOver!: CreationOptional<boolean>;
  isStarted!: CreationOptional<boolean>;
  declare Player: NonAttribute<Player>;
  declare Boards: NonAttribute<Board[]>;
  declare getBoards: HasManyGetAssociationsMixin<Board>;
  static associate: (models: any) => void;
}

Game.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(6),
    unique: true
  },
  isOver: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isStarted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Game'
});

Game.associate = function (models) {
  Game.hasMany(models.Board);
  Game.hasOne(models.Game_Settings);
  Game.hasMany(models.Card);
};

export default Game;

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Game from './game';
import GameState from './game_state';

class GameSettings extends Model<InferAttributes<GameSettings>, InferCreationAttributes<GameSettings>> {
  id!: CreationOptional<number>;
  timer!: number;
  playerTurn!: CreationOptional<number>;
  nbPlayers!: CreationOptional<number>;
  gameId!: CreationOptional<number>;
  gameStateId!: CreationOptional<number>;
  static associate: (models: any) => void;
}

GameSettings.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timer: DataTypes.INTEGER,
  playerTurn: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nbPlayers: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Game,
      key: 'id'
    }
  },
  gameStateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: GameState,
      key: 'id'
    }
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'Game_Settings',
});

GameSettings.associate = function (models) {
  GameSettings.belongsTo(models.Game);
  GameSettings.belongsTo(models.Game_State);
};

export default GameSettings;

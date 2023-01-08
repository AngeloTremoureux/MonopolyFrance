import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class GameSettings extends Model<InferAttributes<GameSettings>, InferCreationAttributes<GameSettings>> {
  id!: CreationOptional<number>;
  timer!: number;
  playerTurn!: number|null;
  nbPlayers!: number|null;
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

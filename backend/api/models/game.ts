import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
  id!: CreationOptional<number>;
  code!: string;
  isOver!: boolean;
  isStarted!: boolean;
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

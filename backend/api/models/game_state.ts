import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class GameState extends Model<InferAttributes<GameState>, InferCreationAttributes<GameState>> {
  id!: CreationOptional<number>;
  message!: string;
  static associate: (models: any) => void;
}

GameState.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: DataTypes.STRING
}, {
  timestamps: false,
  sequelize,
  modelName: 'Game_State',
});

GameState.associate = function (models) {
  GameState.hasMany(models.Game_Settings);
};

export default GameState;

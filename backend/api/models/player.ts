import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
  id!: CreationOptional<number>;
  username!: string;
  email!: string;
  password!: string;
  isOnline!: CreationOptional<boolean>;
  key!: string;
  static associate: (models: any) => void;
}

Player.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: DataTypes.STRING,
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  key: DataTypes.STRING
}, {
  timestamps: false,
  sequelize,
  modelName: 'Player',
});

Player.associate = function (models) {
  Player.hasOne(models.Board);
};

export default Player;

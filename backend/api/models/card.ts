import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import CardSettings from './card-settings';
import Game from './game';
import Player from './player';

class Card extends Model<InferAttributes<Card>, InferCreationAttributes<Card>> {
  id!: CreationOptional<number>;
  level!: number;
  cardSettingsId!: CreationOptional<number>;
  gameId!: CreationOptional<number>;
  playerId!: CreationOptional<number>
  static associate: (models: any) => void;
}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  level: DataTypes.INTEGER,
  cardSettingsId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardSettings,
      key: 'id'
    }
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
}, {
  timestamps: false,
  sequelize,
  modelName: 'Card',
});

Card.associate = function (models) {
  Card.belongsTo(models.Card_Settings);
  Card.belongsTo(models.Game);
  Card.belongsTo(models.Player);
};

export default Card;

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize';
import { sequelize } from '.';
import Board from './board';
import CardSettings from './card-settings';
import Game from './game';
import Player from './player';

class Card extends Model<InferAttributes<Card>, InferCreationAttributes<Card>> {
  id!: CreationOptional<number>;
  level!: number;
  CardSettingsId!: CreationOptional<number>;
  GameId!: CreationOptional<number>;
  BoardId!: CreationOptional<number>;
  declare Card_Setting: NonAttribute<CardSettings>;
  declare Games: NonAttribute<Game[]>;
  declare Board: NonAttribute<Board>;
  static associate: (models: any) => void;
}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  level: DataTypes.INTEGER,
  CardSettingsId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardSettings,
      key: 'id'
    }
  },
  GameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Game,
      key: 'id'
    }
  },
  BoardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Board,
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
  Card.belongsTo(models.Board);
};

export default Card;

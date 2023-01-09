import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

class CardSettings extends Model<InferAttributes<CardSettings>, InferCreationAttributes<CardSettings>> {
  id!: CreationOptional<number>;
  nom!: string;
  color!: number;
  cardTypeId!: CreationOptional<number>;
  static associate: (models: any) => void;
}

CardSettings.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING,
  color: DataTypes.INTEGER,
  cardTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CardSettings,
      key: 'id'
    }
  }
}, {
  timestamps: false,
  sequelize,
  modelName: 'Card_Settings',
});

CardSettings.associate = function (models) {
  CardSettings.hasOne(models.Card);
  CardSettings.belongsTo(models.Card_Type);
  CardSettings.hasMany(models.Card_Purchase_Prize);
  CardSettings.hasMany(models.Card_Tax_Amount);
  CardSettings.hasMany(models.Position, {
    foreignKey: {
      name: 'numero',
      defaultValue: 1,
      allowNull: false
    }
  })
};

export default CardSettings;

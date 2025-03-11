import { Model, DataTypes, type Optional } from "sequelize"
import { sequelize } from "."

interface FavoriteAttributes {
  id: number
  userId: number
  storyId: number
  title: string
  url: string
  by: string
  score: number
  time: number
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, "id"> {}

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: number
  public userId!: number
  public storyId!: number
  public title!: string
  public url!: string
  public by!: string
  public score!: number
  public time!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    indexes: [
      {
        unique: true,
        fields: ["userId", "storyId"],
      },
    ],
  },
)

export default Favorite


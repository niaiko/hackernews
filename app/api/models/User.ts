import { Model, DataTypes, type Optional } from "sequelize"
import { sequelize } from "."

interface UserAttributes {
  id: number
  username: string
  email: string
  password: string
  age: number
  description: string
  profileImageUrl: string | null
  profileVisibility: boolean
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "description" | "profileImageUrl"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public username!: string
  public email!: string
  public password!: string
  public age!: number
  public description!: string
  public profileImageUrl!: string | null
  public profileVisibility!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to return user without sensitive information
  public toSafeObject(): Omit<UserAttributes, "password"> {
    const { id, username, email, age, description, profileImageUrl, profileVisibility } = this
    return { id, username, email, age, description, profileImageUrl, profileVisibility }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileVisibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  },
)

export default User


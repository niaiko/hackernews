import { Sequelize } from "sequelize"
import config from "../config/config"

const env = process.env.NODE_ENV || "development"
const dbConfig = config[env]

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
})

import User from "./User"
import Favorite from "./Favorite"

// Associations
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" })
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" })

export const db = {
  sequelize,
  Sequelize,
  User,
  Favorite,
}


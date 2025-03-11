interface DatabaseConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql"
}
interface Config {
  [key: string]: DatabaseConfig
}

const config: Config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "hackernews",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "hackernews_test",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "hackernews_prod",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
}

export default config

// const config = {
//   development: {
//     username: 'root',
//     password: '!pass',
//     database: 'BEALY_TT_DB',
//     host: 'BEALYSQL',
//     dialect: 'mysql',
//   },
// };

// export default config;


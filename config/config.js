require("dotenv").config();

const development = {
  sqlite_app: {
    dialect: "sqlite",
    storage: "data/db.sqlite3",
  },
  sqlite_omop: {
    dialect: "sqlite",
    storage: "data/omop.sqlite3",
  },
};

const test = {
  dialect: "sqlite",
  storage: ":memory:",
};

const production = {
  db_app: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      schema: "app",  
    }
  },
  db_omop: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      schema: "omopcdm",  
    }
  },
};


module.exports = {
  development,
  test,
  production,
};
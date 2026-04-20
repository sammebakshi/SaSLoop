const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000
} : {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "SaSLoop",
  password: process.env.DB_PASSWORD || "shahi",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000
});


module.exports = pool;
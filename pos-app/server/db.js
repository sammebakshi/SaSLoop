const { Pool } = require("pg");
require("dotenv").config({ path: require('path').join(__dirname, '.env') });
// Removed hardcoded override to allow local .env settings to take effect

const config = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000
} : {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sasloop_db",
  password: process.env.DB_PASSWORD || "Admin@123",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000
};

console.log("🔍 [ENV DIAGNOSTIC]", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  HAS_DOTENV: !!require("dotenv").config().parsed
});

console.log(`🔌 [DB CONFIG] Host: ${config.host || 'URL'}, Database: ${config.database || config.connectionString}`);

const pool = new Pool(config);


module.exports = pool;
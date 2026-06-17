const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const config = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
} : {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sasloop_db",
  password: process.env.DB_PASSWORD || "Admin@123",
  port: process.env.DB_PORT || 5432
};

const pool = new Pool(config);

async function run() {
  try {
    console.log("Checking DB Triggers...");
    
    // Check triggers
    const triggerRes = await pool.query(`
      SELECT 
        trg.tgname AS trigger_name,
        tbl.relname AS table_name,
        p.proname AS function_name,
        pg_get_triggerdef(trg.oid) AS trigger_definition
      FROM pg_trigger trg
      JOIN pg_class tbl ON trg.tgrelid = tbl.oid
      JOIN pg_proc p ON trg.tgfoid = p.oid
      WHERE tbl.relname IN ('customer_transactions', 'orders', 'customer_loyalty')
    `);
    console.log("Triggers found:");
    triggerRes.rows.forEach(t => {
      console.log(`\nTrigger: ${t.trigger_name} on table ${t.table_name}`);
      console.log(`Definition: ${t.trigger_definition}`);
    });

  } catch (err) {
    console.error("Database check failed:", err);
  } finally {
    await pool.end();
  }
}

run();

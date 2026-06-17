const { Pool } = require('pg');
const pool = new Pool({user:'postgres',host:'localhost',database:'sasloop_db',password:'Admin@123',port:5432});

async function check() {
  const r = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'app_users' AND column_name LIKE 'meta%' ORDER BY column_name");
  console.log("Meta columns:", r.rows);
  
  const r2 = await pool.query("SELECT id, meta_phone_id FROM app_users WHERE id IN (1, 48)");
  console.log("Users:", r2.rows);
  
  // Check if meta_account_id column exists
  const r3 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'meta_account_id'");
  console.log("Has meta_account_id?", r3.rows.length > 0);
  
  if (r3.rows.length === 0) {
    console.log("Adding meta_account_id column...");
    await pool.query("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS meta_account_id TEXT");
    console.log("Column added!");
  }
  
  await pool.end();
}
check();

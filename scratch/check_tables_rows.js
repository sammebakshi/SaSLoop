const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const tables = [
  'customer_transactions',
  'customer_loyalty',
  'customer_feedback',
  'conversation_sessions',
  'chat_messages',
  'customers',
  'kots',
  'pre_orders',
  'marketing_contacts',
  'orders',
  'business_expenses',
  'inventory_logs'
];

async function checkRows() {
  try {
    // Let's find some user_ids
    const usersRes = await pool.query("SELECT id, name, email, role FROM app_users");
    console.log("Users in DB:");
    usersRes.rows.forEach(u => console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));

    console.log("\nRow count per table per user:");
    for (const user of usersRes.rows) {
      console.log(`\nUser: ${user.name} (${user.id})`);
      for (const table of tables) {
        const idCol = table === 'inventory_logs' ? 'biz_id' : 'user_id';
        try {
          const res = await pool.query(`SELECT COUNT(*) FROM ${table} WHERE ${idCol} = $1`, [user.id]);
          console.log(` - ${table}: ${res.rows[0].count}`);
        } catch (e) {
          console.log(` - ${table}: Error checking - ${e.message}`);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

checkRows();

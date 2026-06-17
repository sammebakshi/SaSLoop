const pool = require('../db');

async function run() {
  try {
    console.log("Backfilling missing customers from marketing_contacts...");
    const res = await pool.query(
      `INSERT INTO customers (user_id, name, number)
       SELECT user_id, COALESCE(name, 'Customer'), phone_number
       FROM marketing_contacts
       ON CONFLICT (user_id, number) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`
    );
    console.log(`Successfully backfilled ${res.rows.length} contacts into customers table!`);
    res.rows.forEach(r => {
      console.log(`- ${r.name} (${r.number})`);
    });
  } catch (err) {
    console.error("Backfill failed:", err.message);
  } finally {
    await pool.end();
  }
}
run();

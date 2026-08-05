const pool = require('../db');

async function test() {
  try {
    const tablesRes = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    console.log("Tables in DB:", tablesRes.rows.map(r => r.table_name));

    for (const t of ['orders', 'pos_orders', 'customer_transactions', 'table_reservations']) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM ${t}`);
        console.log(`Count in ${t}:`, countRes.rows[0].count);
      } catch (e) {}
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();

const pool = require("../db");

async function inspect() {
  try {
    const res = await pool.query(
      "SELECT id, bill_no, total_price, status, created_at, created_at::text as created_at_text FROM orders ORDER BY created_at DESC LIMIT 20"
    );
    console.log("RECENT ORDERS IN DATABASE:");
    console.table(res.rows.map(r => ({
      id: r.id,
      bill_no: r.bill_no,
      total_price: r.total_price,
      status: r.status,
      created_at: r.created_at,
      created_at_text: r.created_at_text,
      iso_string: r.created_at ? new Date(r.created_at).toISOString() : null,
      local_string: r.created_at ? new Date(r.created_at).toLocaleString() : null
    })));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspect();

const pool = require("../db");

async function checkOutletDetails() {
  try {
    const res = await pool.query(
      "SELECT id, username, name, business_name, brand_name, role FROM app_users WHERE id IN (9, 10, 12, 48)"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkOutletDetails();

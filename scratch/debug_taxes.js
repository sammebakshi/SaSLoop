const pool = require("../db");

async function run() {
  try {
    const taxes = await pool.query("SELECT id, tax_name, tax_value, is_inclusive, user_id, outlet_id, is_active FROM tax_configurations");
    console.log("--- Taxes ---");
    console.log(taxes.rows);

    const users = await pool.query("SELECT id, name, email, parent_user_id, role FROM app_users WHERE role IN ('user', 'brand_owner', 'admin', 'staff', 'cashier')");
    console.log("--- Users ---");
    console.log(users.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();

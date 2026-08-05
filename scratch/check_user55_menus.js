const pool = require('../db');

async function test() {
  try {
    const menus = await pool.query(
      `SELECT * FROM outlet_menus WHERE user_id = 55 OR outlet_id = 55`
    );
    console.log("Outlet Menus for User 55:");
    console.table(menus.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();

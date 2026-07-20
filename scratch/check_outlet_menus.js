const pool = require('../db');

async function checkOutletMenus() {
  try {
    const menusRes = await pool.query("SELECT * FROM outlet_menus WHERE user_id = 55");
    console.log("outlet_menus for 55:", menusRes.rows);

    const allMenus = await pool.query("SELECT * FROM outlet_menus");
    console.log("All outlet_menus:", allMenus.rows);

    const restRes = await pool.query("SELECT * FROM restaurants WHERE user_id = 55");
    console.log("restaurants for 55:", restRes.rows);

    const routeItemsRes = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE menu_id IN (SELECT id FROM outlet_menus WHERE user_id = 55)");
    console.log("Items count under outlet_menus of user 55:", routeItemsRes.rows[0].count);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

checkOutletMenus();

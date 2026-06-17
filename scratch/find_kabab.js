const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "sasloop_db",
  password: "Admin@123",
  port: 5432,
});

async function main() {
  try {
    const menusRes = await pool.query(
      `SELECT id, user_id, outlet_id, is_pos_default FROM outlet_menus WHERE user_id = 6 OR outlet_id = 6`
    );
    console.log("Menus for user_id = 6:", menusRes.rows);

    const itemsRes = await pool.query(
      `SELECT id, menu_id, item_name, base_price, image_url FROM outlet_menu_items WHERE (menu_id IN (SELECT id FROM outlet_menus WHERE user_id = 6 OR outlet_id = 6)) AND item_name ILIKE '%KABAB%'`
    );
    console.log("Kabab items for user_id = 6:", itemsRes.rows);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await pool.end();
  }
}

main();

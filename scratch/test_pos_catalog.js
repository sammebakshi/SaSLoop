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
    const outletId = 2;
    const result = await pool.query(
        `SELECT og.id, og.name, og.min_selectable, og.max_selectable, 
                bi.id as item_id, 
                omi.id as outlet_menu_item_id
         FROM option_groups og
         JOIN item_option_groups iog ON og.id = iog.group_id
         LEFT JOIN outlet_menu_items omi ON iog.item_id = omi.id
         LEFT JOIN business_items bi ON (
           (omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
           OR
           ((omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
         ) AND bi.user_id = $1
         WHERE (og.outlet_id = $1 OR (og.outlet_id IS NULL AND og.user_id = $1)) AND og.is_active = true
           AND bi.id = 603`,
        [outletId]
    );
    console.log("Option groups for Kabab (ID 603):", result.rows);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await pool.end();
  }
}

main();

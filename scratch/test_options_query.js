const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const itemId = 5418; // KABAB
    const groupId = 6;   // KABAB Option Group

    const query = `
      SELECT DISTINCT ON (ol.id) ol.id, ol.name, COALESCE(NULLIF(ol.price_override, 0.00), omi.base_price) as price
      FROM options_list ol
      LEFT JOIN outlet_menu_items omi ON ol.name = omi.item_name 
        AND omi.menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1)
        AND (
          omi.item_type = '1' 
          AND omi.id > $1 
          AND omi.id < COALESCE(
            (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1) AND id > $1), 
            99999999
          )
        )
      WHERE ol.group_id = $2 AND ol.is_active = true 
      ORDER BY ol.id, omi.id ASC
    `;
    const res = await pool.query(query, [itemId, groupId]);
    console.log('Query result:');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();

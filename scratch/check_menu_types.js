const pool = require('../db');

async function test() {
  try {
    const items = await pool.query(
      `SELECT id, item_name, base_price, item_type 
       FROM outlet_menu_items 
       WHERE menu_id = 35 
       ORDER BY id ASC`
    );
    console.log(`Total items in Menu 35: ${items.rows.length}`);
    
    // Print all items line by line with item_type
    items.rows.forEach(r => {
      if (r.item_type === '1') {
        console.log(`   └─ [OPTION item_type=1] ID:${r.id} | "${r.item_name}" | Price: ₹${r.base_price}`);
      } else {
        console.log(`[MAIN ITEM item_type=0] ID:${r.id} | "${r.item_name}" | Price: ₹${r.base_price}`);
      }
    });

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, menu_id, short_code, item_name, base_price, category_id, item_type FROM outlet_menu_items ORDER BY id ASC");
  console.log("TOTAL MENU ITEMS:", res.rows.length);
  
  // Find menu_id of DG30
  const dg30 = res.rows.find(r => r.short_code === 'DG30');
  if (dg30) {
    console.log("\nFOUND DG30:", dg30);
    console.log("\nItems in the same menu:", dg30.menu_id);
    const menuItems = res.rows.filter(r => r.menu_id === dg30.menu_id);
    menuItems.forEach((r, idx) => {
      console.log(`[${idx}] id: ${r.id}, short_code: ${r.short_code}, item_name: ${r.item_name}, item_type: ${r.item_type}, category_id: ${r.category_id}`);
    });
  } else {
    console.log("DG30 not found. Printing all items containing meethi:");
    res.rows.forEach(r => {
      if (r.item_name.toLowerCase().includes('meethi')) {
        console.log(`id: ${r.id}, menu_id: ${r.menu_id}, short_code: ${r.short_code}, item_name: ${r.item_name}, item_type: ${r.item_type}, category_id: ${r.category_id}`);
      }
    });
  }

  pool.end();
}

run().catch(console.error);

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, code, product_name, item_type, menu_id, category_id FROM items ORDER BY id ASC");
  console.log("TOTAL ITEMS:", res.rows.length);
  console.log("---");
  res.rows.forEach(row => {
    if (row.code && (row.code.includes('DG30') || row.code.includes('DG11') || row.code.includes('DG12') || row.code.includes('DG20') || row.code.includes('DG21') || row.code.includes('DG31') || row.code.includes('DG32') || row.product_name.toLowerCase().includes('meethi'))) {
      console.log(`id: ${row.id}, code: ${row.code}, product_name: ${row.product_name}, item_type: ${row.item_type}, menu_id: ${row.menu_id}, category_id: ${row.category_id}`);
    }
  });
  
  console.log("--- ALL ITEMS NEAR DG30 ---");
  const idx = res.rows.findIndex(row => row.code && row.code.includes('DG30'));
  if (idx !== -1) {
    const start = Math.max(0, idx - 5);
    const end = Math.min(res.rows.length, idx + 10);
    for (let i = start; i < end; i++) {
      const row = res.rows[i];
      console.log(`[${i}] id: ${row.id}, code: ${row.code}, product_name: ${row.product_name}, item_type: ${row.item_type}, menu_id: ${row.menu_id}, category_id: ${row.category_id}`);
    }
  }

  pool.end();
}

run().catch(console.error);

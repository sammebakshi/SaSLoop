const pool = require('./db');

async function migrate() {
  try {
    await pool.query("ALTER TABLE outlet_menus ADD COLUMN IF NOT EXISTS is_table_default BOOLEAN DEFAULT false;");
    console.log("✅ is_table_default column checked/added to outlet_menus!");
    
    const res = await pool.query("SELECT id, menu_name, is_pos_default, is_digital_default, is_table_default FROM outlet_menus LIMIT 10;");
    console.log("Sample outlet_menus rows:", res.rows);
  } catch (e) {
    console.error("Migration error:", e);
  } finally {
    await pool.end();
  }
}

migrate();

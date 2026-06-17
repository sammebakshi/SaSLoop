const pool = require("../db");

async function seed() {
  try {
    // Check columns of tables_list
    const cols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tables_list'
    `);
    console.log("tables_list columns:");
    console.table(cols.rows);

    // Check existing tables in tables_list
    const existing = await pool.query("SELECT * FROM tables_list");
    console.log("Existing tables in tables_list:");
    console.table(existing.rows);

    // If empty or no tables for user_id = 55, insert some
    const user55Tables = existing.rows.filter(r => r.user_id === 55 || r.outlet_id === 55);
    if (user55Tables.length === 0) {
      console.log("Seeding tables for user_id = 55...");
      // Let's check if department_id is nullable or if table_departments has rows
      const depts = await pool.query("SELECT * FROM table_departments");
      console.log("Existing table_departments:");
      console.table(depts.rows);

      // We will insert simple tables: TABLE 1, TABLE 2, TABLE 3, TABLE 4, TABLE 5, TABLE 6
      const names = ["TABLE 1", "TABLE 2", "TABLE 3", "TABLE 4", "TABLE 5", "TABLE 6"];
      for (const name of names) {
        await pool.query(
          "INSERT INTO tables_list (user_id, name, max_persons, is_active, outlet_id) VALUES ($1, $2, $3, $4, $5)",
          [55, name, 4, true, 55]
        );
      }
      console.log("Tables seeded successfully!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

seed();

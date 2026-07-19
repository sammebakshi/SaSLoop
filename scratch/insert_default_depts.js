const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432,
});

async function main() {
  const userId = 55; // owner user_id

  try {
    console.log("Cleaning up old departments for user 55...");
    await pool.query("DELETE FROM table_departments WHERE user_id = $1", [userId]);
    await pool.query("UPDATE tables_list SET department_id = NULL WHERE user_id = $1", [userId]);

    const depts = [
      'Non AC Section',
      'AC Section & BAR',
      'Rooms',
      'VIP',
      'Pickup'
    ];

    console.log("Inserting new table departments...");
    const deptIdMap = {};
    for (const name of depts) {
      const res = await pool.query(
        `INSERT INTO table_departments (user_id, outlet_id, department_name, is_active, created_at)
         VALUES ($1, $2, $3, true, NOW()) RETURNING id`,
        [userId, userId, name]
      );
      deptIdMap[name] = res.rows[0].id;
    }
    console.log("Created departments:", deptIdMap);

    // Fetch current tables
    const tablesRes = await pool.query(
      "SELECT id, name FROM tables_list WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );
    const tables = tablesRes.rows;
    console.log(`Mapping ${tables.length} tables to departments...`);

    for (const table of tables) {
      // Parse table number/suffix
      const name = table.name.toUpperCase();
      let targetDept = 'Non AC Section';

      if (name.includes('TABLE 1') || name.includes('TABLE 2') || name.includes('TABLE 3') || name.includes('TABLE 4') || name.includes('TABLE 5')) {
        targetDept = 'Non AC Section';
      } else if (name.includes('TABLE 6') || name.includes('TABLE 7') || name.includes('TABLE 8') || name.includes('TABLE 9') || name.includes('TABLE 10')) {
        targetDept = 'AC Section & BAR';
      } else if (name.includes('TABLE 11') || name.includes('TABLE 12') || name.includes('TABLE 13') || name.includes('TABLE 14') || name.includes('TABLE 15')) {
        targetDept = 'Rooms';
      } else if (name.includes('TABLE 16') || name.includes('TABLE 17') || name.includes('TABLE 18') || name.includes('TABLE 19') || name.includes('TABLE 20')) {
        targetDept = 'VIP';
      }

      const deptId = deptIdMap[targetDept];
      await pool.query(
        "UPDATE tables_list SET department_id = $1 WHERE id = $2",
        [deptId, table.id]
      );
      console.log(`Mapped table '${table.name}' to department '${targetDept}'`);
    }

    console.log("Success! Departments populated and mapped.");
  } catch (err) {
    console.error("Error populating departments:", err);
  } finally {
    await pool.end();
  }
}
main();

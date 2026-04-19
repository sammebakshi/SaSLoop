const pool = require("./db");

async function clearDatabase() {
  try {
    console.log("Connecting to database...");
    
    // First, delete related restaurants to avoid foreign key constraint errors
    // Assuming restaurants are linked to users. We only delete restaurants not linked to a master_admin, or simply all restaurants if master admins don't have restaurants.
    // Let's delete all restaurants linked to non-master admins
    await pool.query("DELETE FROM menu WHERE restaurant_id IN (SELECT id FROM restaurants WHERE user_id IN (SELECT id FROM app_users WHERE role != 'master_admin'))");
    console.log("Orphaned menus cleared.");

    await pool.query("DELETE FROM restaurants WHERE user_id IN (SELECT id FROM app_users WHERE role != 'master_admin')");
    console.log("Orphaned restaurants cleared.");

    const res = await pool.query("DELETE FROM app_users WHERE role != 'master_admin' RETURNING id");
    console.log(`Successfully deleted ${res.rowCount} non-master accounts.`);

  } catch (err) {
    console.error("Error clearing database:", err);
  } finally {
    pool.end();
  }
}

clearDatabase();

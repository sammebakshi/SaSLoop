const pool = require('../db');

async function enableSearchPermissions() {
  try {
    console.log("Connecting to database...");
    const res = await pool.query("SELECT id, name, username, role, staff_permissions FROM app_users");
    console.log(`Found ${res.rows.length} users in the database.`);
    
    let updatedCount = 0;
    for (const row of res.rows) {
      let perms = row.staff_permissions;
      if (!perms) {
        // If they don't have staff_permissions, we can initialize it
        perms = {};
      } else if (typeof perms === 'string') {
        try {
          perms = JSON.parse(perms);
        } catch (e) {
          console.error(`Failed to parse permissions for user ${row.username}:`, e);
          perms = {};
        }
      }
      
      if (!perms.pos_access) perms.pos_access = {};
      if (!perms.pos_access.OrderWindow) perms.pos_access.OrderWindow = {};
      
      // We set these permissions to true
      perms.pos_access.OrderWindow.search_table = true;
      perms.pos_access.OrderWindow.search_by_code = true;
      perms.pos_access.OrderWindow.search_by_name = true;
      perms.pos_access.OrderWindow.delete_search = true;
      
      await pool.query(
        "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
        [JSON.stringify(perms), row.id]
      );
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} users in the database with search permissions enabled.`);
  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    await pool.end();
  }
}

enableSearchPermissions();

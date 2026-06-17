const pool = require('../db');
async function run() {
  const menusRes = await pool.query(`
    SELECT id, outlet_id, menu_name, is_pos_default FROM outlet_menus
  `);
  console.log("OUTLET MENUS:", menusRes.rows);

  const usersRes = await pool.query(`
    SELECT id, name, username, email, parent_user_id, role FROM app_users
  `);
  console.log("APP USERS:", usersRes.rows);

  await pool.end();
}
run();

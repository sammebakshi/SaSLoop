const pool = require("../db");

async function checkTables() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("Tables:", res.rows.map(r => r.table_name));
    
    // Check users / digital settings
    const users = await pool.query("SELECT id, name, business_name, settings FROM users WHERE id = 55 OR email LIKE '%shahe%'");
    console.log("Users found:", users.rows.length);
    for (let u of users.rows) {
      console.log("User id:", u.id, "Name:", u.name, "Settings keys:", Object.keys(u.settings || {}));
      if (u.settings) {
        delete u.settings.otherTagline;
        delete u.settings.tagline;
        if (u.settings.theme) {
          delete u.settings.theme.otherTagline;
          delete u.settings.theme.tagline;
        }
        await pool.query("UPDATE users SET settings = $1 WHERE id = $2", [u.settings, u.id]);
        console.log("Cleared tagline from user settings!");
      }
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

checkTables();

const pool = require("../db");

async function cleanTagline() {
  try {
    const res = await pool.query("SELECT id, settings FROM businesses WHERE user_id = 55 OR id = 3");
    console.log("Found businesses:", res.rows.length);
    for (const row of res.rows) {
      let settings = row.settings || {};
      console.log("Current tagline:", settings.tagline);
      console.log("Current otherTagline:", settings.otherTagline);
      
      delete settings.tagline;
      delete settings.otherTagline;
      if (settings.theme) {
        delete settings.theme.tagline;
        delete settings.theme.otherTagline;
      }
      
      await pool.query("UPDATE businesses SET settings = $1 WHERE id = $2", [settings, row.id]);
      console.log(`✅ Cleared tagline for business ID ${row.id}`);
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

cleanTagline();

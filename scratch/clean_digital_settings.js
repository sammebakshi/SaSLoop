const pool = require("../db");

async function checkAndClean() {
  try {
    const rests = await pool.query("SELECT id, name, settings FROM restaurants");
    console.log("Restaurants count:", rests.rows.length);
    for (let r of rests.rows) {
      let settings = r.settings || {};
      console.log(`Rest ID ${r.id} (${r.name}) tagline:`, settings.otherTagline, settings.tagline);
      if (settings.theme) {
        console.log("Theme tagline:", settings.theme.tagline, settings.theme.otherTagline);
        delete settings.theme.tagline;
        delete settings.theme.otherTagline;
      }
      delete settings.otherTagline;
      delete settings.tagline;
      await pool.query("UPDATE restaurants SET settings = $1 WHERE id = $2", [settings, r.id]);
    }
    
    const dig = await pool.query("SELECT * FROM digital_order_settings");
    console.log("Digital order settings rows:", dig.rows.length);
    for (let d of dig.rows) {
      console.log(`Dig ID ${d.id} tagline:`, d.tagline);
      await pool.query("UPDATE digital_order_settings SET tagline = '' WHERE id = $1", [d.id]);
    }
    console.log("✅ Cleared taglines successfully!");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

checkAndClean();

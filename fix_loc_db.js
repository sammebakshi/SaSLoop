const pool = require("./db");

async function updateLoc() {
  try {
    await pool.query("UPDATE restaurants SET latitude = 34.083932, longitude = 74.796942 WHERE name LIKE '%Shahe Tehzeeb%'");
    console.log("SUCCESS: Restaurant location updated to 34.083932, 74.796942");
    
    // Also verify it
    const res = await pool.query("SELECT latitude, longitude FROM restaurants WHERE name LIKE '%Shahe Tehzeeb%'");
    console.log("New DB Data:", res.rows[0]);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateLoc();

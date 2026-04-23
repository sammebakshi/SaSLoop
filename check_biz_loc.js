const pool = require("./db");

async function checkBizLocation() {
  try {
    const res = await pool.query("SELECT name, latitude, longitude, delivery_radius_km FROM restaurants LIMIT 5");
    console.log("Restaurant Locations in DB:");
    res.rows.forEach(r => {
      console.log(`- ${r.name}: Lat: ${r.latitude}, Long: ${r.longitude}, Radius: ${r.delivery_radius_km}km`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBizLocation();

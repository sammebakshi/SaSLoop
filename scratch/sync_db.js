const pool = require("../db");
const { initializeDatabase } = require("../dbInit");

async function sync() {
    console.log("Forcing DB Sync...");
    await initializeDatabase();
    process.exit(0);
}
sync();

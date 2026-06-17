const { initializeDatabase } = require("../dbInit");
initializeDatabase()
  .then(() => {
    console.log("Database initialized and migrations run successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });

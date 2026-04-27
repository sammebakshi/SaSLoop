const pool = require('../db');
console.log('Connected to Database:', pool.options.database);
process.exit();

const pool = require('./db');
pool.query('SELECT items FROM orders ORDER BY id DESC LIMIT 2').then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
});

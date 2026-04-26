const pool = require('./db');
pool.query('SELECT * FROM menu LIMIT 1').then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
});

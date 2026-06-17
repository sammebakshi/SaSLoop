const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const numbers = ['+919469697216', '919469697216', '+918494089744', '918494089744', '+917006089744', '917006089744'];
  for (const num of numbers) {
    const res = await pool.query("SELECT * FROM customers WHERE number = $1 OR number = $2 OR number LIKE $3", [num, '+' + num, '%' + num]);
    console.log(`Searching for: ${num}`);
    if (res.rows.length > 0) {
      res.rows.forEach(row => {
        console.log(`  Found customer: id=${row.id}, name=${row.name}, number=${row.number}, user_id=${row.user_id}`);
      });
    } else {
      console.log(`  Not found`);
    }
  }
  pool.end();
}

run().catch(console.error);

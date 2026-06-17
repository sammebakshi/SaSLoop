const pool = require("../db");

async function run() {
  try {
    // Format local start/end as YYYY-MM-DD HH:mm:ss
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, '0');
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);

    const startLocalStr = formatDate(start);
    const endLocalStr = formatDate(end);

    console.log("Start local string:", startLocalStr);
    console.log("End local string:", endLocalStr);

    const pgCast = await pool.query(
      "SELECT $1::timestamp as cast_start, $2::timestamp as cast_end",
      [startLocalStr, endLocalStr]
    );
    console.log("PostgreSQL casted local values:", pgCast.rows[0]);

    const queryText = "SELECT id, created_at, total_price, customer_name FROM orders WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3 ORDER BY created_at DESC";
    const dbRes = await pool.query(queryText, [48, startLocalStr, endLocalStr]);
    console.log(`Query returned ${dbRes.rows.length} orders:`);
    console.table(dbRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();

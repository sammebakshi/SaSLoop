const pool = require('/home/ubuntu/SaSLoop/db');

(async () => {
  try {
    const res = await pool.query('DELETE FROM orders WHERE user_id = 2');
    console.log(`✅ Successfully deleted ${res.rowCount} old test orders!`);
    process.exit(0);
  } catch (e) {
    console.error('Error clearing orders:', e.message);
    process.exit(1);
  }
})();

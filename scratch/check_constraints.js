const pool = require('./SaSLoop/db');
(async () => {
  try {
    const discountsCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'discounts';
    `);
    console.log("DISCOUNTS COLUMNS:", discountsCols.rows);

    const discountsConstraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'discounts'::regclass;
    `);
    console.log("DISCOUNTS CONSTRAINTS:", discountsConstraints.rows);

    const chargesConstraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'additional_charges'::regclass;
    `);
    console.log("CHARGES CONSTRAINTS:", chargesConstraints.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();

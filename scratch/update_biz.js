const pool = require("../db");
async function update() {
  try {
    await pool.query(`
      UPDATE restaurants 
      SET social_facebook = 'https://facebook.com/ShaheTehzeeb',
          social_instagram = 'https://instagram.com/ShaheTehzeeb',
          settings = settings || '{"google_review_link": "https://share.google/PG8UHXrpgRGH"}'::jsonb
      WHERE id = 37
    `);
    console.log("Updated business 37");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
update();

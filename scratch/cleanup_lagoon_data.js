const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function cleanup() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('=== CLEANING UP LAGOON MENU DATA FOR USER 48 ===\n');

    // 1. Delete outlet_menu_items for menu 33
    const omi = await client.query('DELETE FROM outlet_menu_items WHERE menu_id = 33 RETURNING id');
    console.log(`Deleted ${omi.rowCount} outlet_menu_items from menu 33`);

    // 2. Delete recipes linked to user 48's business_items
    const recipes = await client.query(
      'DELETE FROM recipes WHERE menu_item_id IN (SELECT id FROM business_items WHERE user_id = 48) RETURNING id'
    );
    console.log(`Deleted ${recipes.rowCount} recipes linked to user 48 items`);

    // 3. Delete item_nutrition linked to user 48's business_items
    const nutrition = await client.query(
      'DELETE FROM item_nutrition WHERE item_id IN (SELECT id FROM business_items WHERE user_id = 48) RETURNING id'
    );
    console.log(`Deleted ${nutrition.rowCount} item_nutrition entries`);

    // 4. Delete business_items for user 48
    const bi = await client.query('DELETE FROM business_items WHERE user_id = 48 RETURNING id');
    console.log(`Deleted ${bi.rowCount} business_items for user 48`);

    // 5. Delete the Lagoon-specific categories (keep original Shahe Tehzeeb ones)
    // The Lagoon categories were: Burgers, Paris Fusion, Dips, Starters, Soup, Salad, Pasta, 
    // Cookies, Falooda & Smoothie, Hot Drinks, Breakfast (lowercase), Desserts, 
    // BBQ Charcoal Shawaya, Fresh Juice Kuluki & Mojitos, etc.
    // We'll delete ALL categories for user 48 since the original items are gone anyway
    const cats = await client.query('DELETE FROM categories WHERE user_id = 48 RETURNING id, name');
    console.log(`Deleted ${cats.rowCount} categories for user 48`);
    
    // 6. Clean up option_groups for user 48
    const og = await client.query('DELETE FROM option_groups WHERE user_id = 48 RETURNING id');
    console.log(`Deleted ${og.rowCount} option_groups for user 48`);

    await client.query('COMMIT');
    console.log('\n=== CLEANUP COMPLETE ===');
    console.log('You can now add your real menu items through the dashboard.');

    // Verify
    const verifyBI = await client.query('SELECT COUNT(*) as cnt FROM business_items WHERE user_id = 48');
    const verifyOMI = await client.query('SELECT COUNT(*) as cnt FROM outlet_menu_items WHERE menu_id = 33');
    const verifyCats = await client.query('SELECT COUNT(*) as cnt FROM categories WHERE user_id = 48');
    console.log(`\nVerification: business_items=${verifyBI.rows[0].cnt}, menu_items=${verifyOMI.rows[0].cnt}, categories=${verifyCats.rows[0].cnt}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Cleanup failed, rolled back:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();

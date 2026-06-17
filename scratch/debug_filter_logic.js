const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // 1. Fetch all items (simulating allItems in frontend)
    const itemsRes = await pool.query("SELECT * FROM outlet_menu_items");
    const allItems = itemsRes.rows;
    console.log(`Loaded ${allItems.length} items.`);

    // 2. Simulate selecting DG30 (MEETHI) from menu 32
    // Let's find DG30 in menu 32
    const mainItem = allItems.find(i => i.short_code === 'DG30' && i.menu_id === 32);
    if (!mainItem) {
      console.error("Could not find main item DG30 in menu 32");
      return;
    }
    console.log("Simulating selected mainItem:", {
      id: mainItem.id,
      short_code: mainItem.short_code,
      item_name: mainItem.item_name,
      item_type: mainItem.item_type,
      menu_id: mainItem.menu_id
    });

    const associatedOptions = []; // empty for debug

    // 3. Run the exact frontend filtering logic
    const sortedItems = [...allItems].sort((a, b) => a.id - b.id);
    
    console.log("\n--- Simulating nextMainItem search ---");
    const nextMainItem = sortedItems.find(item => 
        (item.item_type === 0 || item.item_type === '0' || item.item_type === 'main') &&
        item.menu_id === mainItem.menu_id &&
        item.id > mainItem.id
    );
    console.log("nextMainItem found:", nextMainItem ? {
      id: nextMainItem.id,
      short_code: nextMainItem.short_code,
      item_name: nextMainItem.item_name,
      item_type: nextMainItem.item_type
    } : "None");

    const nextMainId = nextMainItem ? nextMainItem.id : Infinity;
    console.log("nextMainId resolved to:", nextMainId);

    console.log("\n--- Simulating mainItemOptions filter ---");
    const mainItemOptions = sortedItems.filter(item => 
        (item.item_type === 1 || item.item_type === '1' || item.item_type === 'option') &&
        item.menu_id === mainItem.menu_id &&
        item.id > mainItem.id &&
        item.id < nextMainId &&
        !associatedOptions.some(ao => ao.name === item.product_name || ao.id === item.id)
    );

    console.log(`Found ${mainItemOptions.length} options:`);
    mainItemOptions.forEach(opt => {
      console.log(`- ID: ${opt.id}, Code: ${opt.short_code}, Name: ${opt.item_name}, Type: ${opt.item_type}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();

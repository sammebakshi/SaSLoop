const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  // Fetch All Items
  const itemsRes = await pool.query(`
    SELECT omi.id, 
           omi.menu_id,
           omi.short_code as code, 
           omi.item_name as product_name, 
           omi.base_price as price, 
           omi.is_active as availability, 
           omi.item_type,
           omi.image_url,
           omi.category_id,
           omi.tax_group_id,
           omi.kitchen_dept_id,
           omi.stock_qty as current_stock,
           omi.is_recommended as recommended,
           omi.hsn_code
    FROM outlet_menu_items omi
  `);
  const allItems = itemsRes.rows;

  const menu_id = '32';
  const category_ids = ['16'];
  const associatedOptions = [];
  
  const dg30Item = allItems.find(i => i.code === 'DG30' && String(i.menu_id) === String(menu_id));
  if (!dg30Item) {
    console.error("DG30 item not found!");
    pool.end();
    return;
  }
  
  const linked_main_items_create = [{ ...dg30Item, item_id: dg30Item.id }];

  console.log("\n--- SIMULATING CREATE MODE (item has both id and item_id) ---");
  runFilterLogic(allItems, menu_id, category_ids, linked_main_items_create, associatedOptions);

  const linked_main_items_edit = [{
    item_id: dg30Item.id,
    product_name: dg30Item.product_name,
    code: dg30Item.code,
    menu_id: dg30Item.menu_id,
    category_id: dg30Item.category_id
  }];

  console.log("\n--- SIMULATING EDIT MODE (item only has item_id, id is undefined) ---");
  runFilterLogic(allItems, menu_id, category_ids, linked_main_items_edit, associatedOptions);

  pool.end();
}

function runFilterLogic(allItems, menu_id, category_ids, linked_main_items, associatedOptions) {
  if (menu_id && category_ids.length > 0) {
    const selectedCatId = parseInt(category_ids[0]);

    // 1. Load Main Items (Type 0) for the selected category
    const mainItems = allItems.filter(item => {
      const isMain = item.item_type === 0 || item.item_type === '0' || String(item.item_type).toLowerCase() === 'main';
      const isInMenu = parseInt(item.menu_id) === parseInt(menu_id);
      const isInCategory = parseInt(item.category_id) === parseInt(selectedCatId);
      return isMain && isInMenu && isInCategory;
    });
    console.log(`Filtered Main Items count: ${mainItems.length}`);

    // 2. Load Options (Type 1) ONLY for the selected main items in Search Item
    const options = [];
    if (linked_main_items && linked_main_items.length > 0) {
      const sortedItems = [...allItems].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      linked_main_items.forEach(mainItem => {
        const mainItemId = parseInt(mainItem.item_id || mainItem.id);
        const nextMainItem = sortedItems.find(item => 
          (item.item_type === 0 || item.item_type === '0' || String(item.item_type).toLowerCase() === 'main') &&
          parseInt(item.menu_id) === parseInt(mainItem.menu_id) &&
          parseInt(item.id) > mainItemId
        );
        const nextMainId = nextMainItem ? parseInt(nextMainItem.id) : Infinity;
        
        console.log(`For mainItem code=${mainItem.code || mainItem.product_name}, id=${mainItem.id}, item_id=${mainItem.item_id}:`);
        console.log(`  nextMainItem: ${nextMainItem ? `${nextMainItem.code} (id: ${nextMainItem.id})` : 'None'}`);
        console.log(`  nextMainId: ${nextMainId}`);

        const mainItemOptions = sortedItems.filter(item => 
          (item.item_type === 1 || item.item_type === '1' || String(item.item_type).toLowerCase() === 'option') &&
          parseInt(item.menu_id) === parseInt(mainItem.menu_id) &&
          parseInt(item.id) > mainItemId &&
          parseInt(item.id) < nextMainId &&
          !associatedOptions.some(ao => String(ao.name) === String(item.product_name) || parseInt(ao.id) === parseInt(item.id))
        );
        
        console.log(`  Found options count: ${mainItemOptions.length}`);
        mainItemOptions.forEach(opt => {
          console.log(`    - id: ${opt.id}, code: ${opt.code}, name: ${opt.product_name}`);
        });

        mainItemOptions.forEach(opt => {
          if (!options.some(o => parseInt(o.id) === parseInt(opt.id))) {
            options.push(opt);
          }
        });
      });
    }
    console.log(`Final Available Options count: ${options.length}`);
  } else {
    console.log("Menu ID or Category IDs empty!");
  }
}

run().catch(console.error);

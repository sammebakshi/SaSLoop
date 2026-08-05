const pool = require('../db');

async function auditAndFixAllFoodTypes() {
    console.log("🔍 Auditing & updating food_type in BOTH Backoffice (outlet_menu_items & business_items)...");

    const nonVegKeywords = [
        'chicken', 'mutton', 'kabab', 'seek', 'tabak', 'wazwan', 
        'meat', 'fish', 'egg', 'omelette', 'poach', 'keema', 'gosht', 'kanti', 'rogan', 
        'rista', 'gushtaba', 'lolipop', 'drum stick', 'thali', 
        'chicken blast', 'afghani'
    ];

    // 1. Update outlet_menu_items
    const omiRes = await pool.query(
        `SELECT omi.id, omi.item_name, c.name as category 
         FROM outlet_menu_items omi 
         LEFT JOIN categories c ON omi.category_id = c.id`
    );

    let omiVeg = 0;
    let omiNonVeg = 0;

    for (let item of omiRes.rows) {
        const nameLower = item.item_name.toLowerCase();
        const catLower = (item.category || '').toLowerCase();
        let isVeg = true;

        if (nameLower.includes('veg ') || nameLower.includes('vegetable') || nameLower.startsWith('veg ') || nameLower.includes('paneer') || nameLower.includes('mushroom') || nameLower.includes('dal ')) {
            isVeg = true;
        } else if (nonVegKeywords.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
            isVeg = false;
        } else {
            isVeg = true;
        }

        const targetFoodType = isVeg ? 'veg' : 'non-veg';
        await pool.query(
            "UPDATE outlet_menu_items SET food_type = $1 WHERE id = $2",
            [targetFoodType, item.id]
        );

        if (isVeg) omiVeg++;
        else omiNonVeg++;
    }

    // 2. Update business_items (Backoffice catalog)
    const biRes = await pool.query("SELECT id, product_name, category FROM business_items");
    let biVeg = 0;
    let biNonVeg = 0;

    for (let item of biRes.rows) {
        const nameLower = (item.product_name || '').toLowerCase();
        const catLower = (item.category || '').toLowerCase();
        let isVeg = true;

        if (nameLower.includes('veg ') || nameLower.includes('vegetable') || nameLower.startsWith('veg ') || nameLower.includes('paneer') || nameLower.includes('mushroom') || nameLower.includes('dal ')) {
            isVeg = true;
        } else if (nonVegKeywords.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
            isVeg = false;
        } else {
            isVeg = true;
        }

        const targetFoodType = isVeg ? 'veg' : 'non-veg';
        await pool.query(
            "UPDATE business_items SET food_type = $1, is_veg = $2 WHERE id = $3",
            [targetFoodType, isVeg, item.id]
        );

        if (isVeg) biVeg++;
        else biNonVeg++;
    }

    console.log(`✅ BACKOFFICE & ONLINE SYNC COMPLETE!`);
    console.log(`• outlet_menu_items: Total ${omiRes.rows.length} | Veg: ${omiVeg} | Non-Veg: ${omiNonVeg}`);
    console.log(`• business_items: Total ${biRes.rows.length} | Veg: ${biVeg} | Non-Veg: ${biNonVeg}`);
    process.exit(0);
}

auditAndFixAllFoodTypes().catch(err => {
    console.error("❌ Fix error:", err);
    process.exit(1);
});

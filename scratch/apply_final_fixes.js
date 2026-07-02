const fs = require('fs');
const path = require('path');

// ==========================================
// 1. PATCH: routes/catalogRoutes.js to load full catalog
// ==========================================
const catalogRoutesPath = path.join(__dirname, '../routes/catalogRoutes.js');
let catalogContent = fs.readFileSync(catalogRoutesPath, 'utf8');
catalogContent = catalogContent.replace(/\r\n/g, '\n');

const targetGetRoute = `// GET all items for the user from the business items catalog
// Excludes option/variant items (item_type = '1' in outlet_menu_items)
// so they only appear inside option group dialogs, not as standalone menu tiles.
router.get("/", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;

        // Check if there are any outlet menus defined for this user/outlet
        const activeMenuCheck = await pool.query(
            \`SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1\`,
            [ownerId]
        );

        if (activeMenuCheck.rows.length === 0) {
            // Legacy / Fallback mode: No menus configured, return all business items
            const result = await pool.query(
                \`SELECT bi.id, 
                        bi.user_id,
                        bi.code, 
                        bi.product_name, 
                        bi.product_name as name, 
                        bi.price, 
                        bi.availability, 
                        bi.image_url, 
                        bi.description, 
                        bi.tax_applicable,
                        bi.is_veg,
                        CASE WHEN bi.is_veg = true THEN 'veg' ELSE 'non-veg' END as food_type,
                        bi.stock_count,
                        bi.tax_percent,
                        bi.variants,
                        bi.modifiers,
                        bi.kot_category,
                        bi.hsn_code,
                        bi.barcode,
                        bi.cost_price,
                        bi.category,
                        bi.sub_category,
                        bi.sale_price_2,
                        bi.sale_price_3,
                        (
                          SELECT jsonb_object_agg(order_type, price)
                          FROM item_multiple_pricing
                          WHERE item_id = bi.id
                        ) as multiple_pricing
                 FROM business_items bi
                 WHERE bi.user_id = $1
                   AND NOT EXISTS (
                     SELECT 1 FROM outlet_menu_items omi
                     WHERE omi.short_code = bi.code
                       AND bi.code IS NOT NULL AND bi.code != ''
                       AND omi.item_type = '1'
                   )
                 ORDER BY bi.id ASC\`,
                [ownerId]
            );
            return res.json(result.rows);
        }

        // Menus exist, resolve all POS-default menus
        const posMenuRes = await pool.query(
            \`SELECT id FROM outlet_menus 
             WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true\`,
            [ownerId]
        );

        if (posMenuRes.rows.length === 0) {
            // Menus exist but none is marked as POS default -> return empty catalog
            return res.json([]);
        }

        const menuIds = posMenuRes.rows.map(row => row.id);

        // Fetch items matching any of these menus
        // Prioritize joins on:
        // 1. omi.item_id = bi.id
        // 2. omi.short_code = bi.code
        // 3. omi.item_name = bi.product_name
        // Use DISTINCT ON (bi.id) to prevent duplicate items if shared across multiple active menus
        const result = await pool.query(
            \`SELECT DISTINCT ON (bi.id)
                    bi.id, 
                    bi.user_id,
                    COALESCE(omi.short_code, bi.code) as code, 
                    omi.item_name as product_name, 
                    omi.item_name as name, 
                    omi.base_price as price, 
                    omi.is_active as availability, 
                    COALESCE(omi.image_url, bi.image_url) as image_url, 
                    COALESCE(omi.description, bi.description) as description, 
                    bi.tax_applicable,
                    CASE WHEN omi.food_type = 'veg' THEN true ELSE false END as is_veg,
                    omi.food_type,
                    omi.stock_qty as stock_count,
                    bi.tax_percent,
                    bi.variants,
                    bi.modifiers,
                    bi.kot_category,
                    COALESCE(omi.hsn_code, bi.hsn_code) as hsn_code,
                    bi.barcode,
                    bi.cost_price,
                    COALESCE(c.name, bi.category) as category,
                    bi.sub_category,
                    omi.sale_price_2,
                    omi.sale_price_3,
                    (
                      SELECT jsonb_object_agg(order_type, price)
                      FROM item_multiple_pricing
                      WHERE item_id = bi.id
                    ) as multiple_pricing
             FROM business_items bi
             JOIN outlet_menu_items omi ON omi.menu_id = ANY($2) AND (
               (omi.item_id = bi.id)
               OR (omi.item_id IS NULL AND omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
               OR (omi.item_id IS NULL AND (omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
             )
             LEFT JOIN categories c ON omi.category_id = c.id
             WHERE bi.user_id = $1
               AND omi.item_type = '0'
             ORDER BY bi.id ASC, omi.id ASC\`,
            [ownerId, menuIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});`;

const replacementGetRoute = `// GET all items for the user from the business items catalog
// Excludes option/variant items (item_type = '1' in outlet_menu_items)
// so they only appear inside option group dialogs, not as standalone menu tiles.
router.get("/", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;
        console.log(\`[CATALOG] Fetching full catalog for business \${ownerId}\`);
        const result = await pool.query(
            \`SELECT bi.id, 
                    bi.user_id,
                    bi.code, 
                    bi.product_name, 
                    bi.product_name as name, 
                    bi.price, 
                    bi.availability, 
                    bi.image_url, 
                    bi.description, 
                    bi.tax_applicable,
                    bi.is_veg,
                    CASE WHEN bi.is_veg = true THEN 'veg' ELSE 'non-veg' END as food_type,
                    bi.stock_count,
                    bi.tax_percent,
                    bi.variants,
                    bi.modifiers,
                    bi.kot_category,
                    bi.hsn_code,
                    bi.barcode,
                    bi.cost_price,
                    bi.category,
                    bi.sub_category,
                    bi.sale_price_2,
                    bi.sale_price_3,
                    (
                      SELECT jsonb_object_agg(order_type, price)
                      FROM item_multiple_pricing
                      WHERE item_id = bi.id
                    ) as multiple_pricing
             FROM business_items bi
             WHERE bi.user_id = $1
               AND NOT EXISTS (
                 SELECT 1 FROM outlet_menu_items omi
                 WHERE omi.short_code = bi.code
                   AND bi.code IS NOT NULL AND bi.code != ''
                   AND omi.item_type = '1'
               )
             ORDER BY bi.id ASC\`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("[CATALOG-ERROR] Failed to fetch catalog:", err);
        res.status(500).json({ error: err.message });
    }
});`;

if (catalogContent.includes(targetGetRoute)) {
  catalogContent = catalogContent.replace(targetGetRoute, replacementGetRoute);
  fs.writeFileSync(catalogRoutesPath, catalogContent, 'utf8');
  console.log("Success: Patched backend catalog route to return full menu");
} else {
  console.error("Error: Could not find target catalog GET route!");
}


// ==========================================
// 2. PATCH: pos-app/src/App.jsx (segmented toggle and empty placeholder)
// ==========================================
const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(/\r\n/g, '\n');

// 2a. Replace pickup/delivery toggle with segmented control
const targetToggleBlock = `                      {orderType === 'PICKUP' && (
                        <div className="flex items-center gap-2 pr-1">
                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={subOrderType === 'DELIVERY'}
                              onChange={e => {
                                const newType = e.target.checked ? 'DELIVERY' : 'PICKUP';
                                setSubOrderType(newType);
                                if (selectedTable && selectedTable.is_temporary) {
                                  let newName = selectedTable.table_name;
                                  if (selectedTable.table_name.startsWith('Pickup #')) {
                                    newName = selectedTable.table_name.replace('Pickup #', 'Delivery #');
                                  } else if (selectedTable.table_name.startsWith('Delivery #')) {
                                    newName = selectedTable.table_name.replace('Delivery #', 'Pickup #');
                                  }
                                  const updatedTable = {
                                    ...selectedTable,
                                    table_name: newName,
                                    original_sub_order_type: newType
                                  };
                                  setSelectedTable(updatedTable);
                                  setTables(tPrev => tPrev.map(t => t.id === selectedTable.id ? updatedTable : t));
                                }
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-[#388e67]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#388e67]"></div>
                            <span className={\`ml-1 text-[10px] font-semibold \${isDark ? 'text-gray-300' : 'text-slate-700'}\`}>{subOrderType === 'DELIVERY' ? 'Delivery' : 'PickUp'}</span>
                          </label>`;

const replacementToggleBlock = `                      {orderType === 'PICKUP' && (
                        <div className="flex items-center gap-2 pr-1">
                          {/* Segmented Toggle Control */}
                          <div className={\`flex rounded-lg overflow-hidden border p-0.5 text-[9px] font-black uppercase tracking-wider \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-300 bg-slate-200/50'}\`}>
                            <button
                              type="button"
                              onClick={() => {
                                const newType = 'PICKUP';
                                setSubOrderType(newType);
                                if (selectedTable && selectedTable.is_temporary) {
                                  let newName = selectedTable.table_name;
                                  if (selectedTable.table_name.startsWith('Delivery #')) {
                                    newName = selectedTable.table_name.replace('Delivery #', 'Pickup #');
                                  }
                                  const updatedTable = {
                                    ...selectedTable,
                                    table_name: newName,
                                    original_sub_order_type: newType
                                  };
                                  setSelectedTable(updatedTable);
                                  setTables(tPrev => tPrev.map(t => t.id === selectedTable.id ? updatedTable : t));
                                }
                              }}
                              className={\`px-2.5 py-1 rounded transition-all cursor-pointer \${subOrderType === 'PICKUP' ? 'bg-[#10ac84] text-white shadow-sm font-extrabold' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
                            >
                              Pickup
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newType = 'DELIVERY';
                                setSubOrderType(newType);
                                if (selectedTable && selectedTable.is_temporary) {
                                  let newName = selectedTable.table_name;
                                  if (selectedTable.table_name.startsWith('Pickup #')) {
                                    newName = selectedTable.table_name.replace('Pickup #', 'Delivery #');
                                  }
                                  const updatedTable = {
                                    ...selectedTable,
                                    table_name: newName,
                                    original_sub_order_type: newType
                                  };
                                  setSelectedTable(updatedTable);
                                  setTables(tPrev => tPrev.map(t => t.id === selectedTable.id ? updatedTable : t));
                                }
                              }}
                              className={\`px-2.5 py-1 rounded transition-all cursor-pointer \${subOrderType === 'DELIVERY' ? 'bg-[#10ac84] text-white shadow-sm font-extrabold' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
                            >
                              Delivery
                            </button>
                          </div>`;

if (appContent.includes(targetToggleBlock)) {
  appContent = appContent.replace(targetToggleBlock, replacementToggleBlock);
  console.log("Success: Updated Pickup/Delivery segmented toggle in App.jsx");
} else {
  console.error("Error: Could not find target toggle switch block!");
}

// 2b. Add empty placeholder to KOT table grid in Pickup/Delivery
const targetGridBlock = `                          {/* TABLE GRID - green buttons matching TMBill */}
                          <div className="flex-1 overflow-y-auto p-1 no-scrollbar">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                              {getFilteredTablesForCurrentView().map(table => {`;

const replacementGridBlock = `                          {/* TABLE GRID - green buttons matching TMBill */}
                          <div className="flex-1 overflow-y-auto p-1 no-scrollbar flex flex-col">
                            {orderType === 'PICKUP' && getFilteredTablesForCurrentView().length === 0 ? (
                              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                                <div className={\`p-4 rounded-full mb-3 \${isDark ? 'bg-gray-800' : 'bg-slate-50'}\`}>
                                  <Receipt size={32} className={isDark ? 'text-gray-500' : 'text-slate-400'} />
                                </div>
                                <h3 className={\`text-xs font-bold uppercase tracking-wider \${isDark ? 'text-gray-200' : 'text-slate-700'}\`}>No Active \${subOrderType === 'DELIVERY' ? 'Delivery' : 'Pickup'} Orders</h3>
                                <p className={\`text-[10px] max-w-xs mt-1 \${isDark ? 'text-gray-500' : 'text-slate-400'}\`}>There are no active \${subOrderType === 'DELIVERY' ? 'delivery' : 'pickup'} orders currently saved in the register.</p>
                                <button
                                  onClick={() => setBillingView('menu')}
                                  className="mt-4 px-4 py-2 bg-[#10ac84] hover:bg-[#0da07b] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Create New Order
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                                {getFilteredTablesForCurrentView().map(table => {`;

const targetGridClose = `                                  );
                               })}
                             </div>
                             {renderPreOrderTempTables()}
                           </div>`;

const replacementGridClose = `                                  );
                               })}
                             </div>
                            )}
                             {renderPreOrderTempTables()}
                           </div>`;

if (appContent.includes(targetGridBlock)) {
  appContent = appContent.replace(targetGridBlock, replacementGridBlock);
  appContent = appContent.replace(targetGridClose, replacementGridClose);
  console.log("Success: Added running orders empty placeholder in App.jsx");
} else {
  console.error("Error: Could not find target grid rendering block!");
}

fs.writeFileSync(appPath, appContent, 'utf8');

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
console.log('Reading from:', filePath);

if (!fs.existsSync(filePath)) {
  console.error('File does not exist!');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

function replaceRegex(name, regex, replacement) {
  if (regex.test(content)) {
    console.log(`[SUCCESS] Matched regex for: ${name}`);
    content = content.replace(regex, replacement);
    return true;
  } else {
    console.error(`[ERROR] Did not match regex for: ${name}`);
    return false;
  }
}

let modified = false;

// 1. Keyboard shortcuts F2/F3/F4 gating with correct mappings
const kbRegex = /if\s*\(e\.key\s*===\s*'F2'\)\s*\{\s*e\.preventDefault\(\);\s*handleCheckout\('PRINT'\);\s*\}\r?\n\s*if\s*\(e\.key\s*===\s*'F3'\)\s*\{\s*e\.preventDefault\(\);\s*handleCheckout\('SETTLE'\);\s*\}\r?\n\s*if\s*\(e\.key\s*===\s*'F4'\)\s*\{\s*e\.preventDefault\(\);\s*handleCheckout\('SAVE'\);\s*\}/;
const kbReplacement = `if (e.key === 'F2') { e.preventDefault(); if (!checkPosAccess('OrderWindow', 'enable_print_settle')) { toast.warning('Print & Save is restricted'); return; } handleCheckout('PRINT'); }
      if (e.key === 'F3') { e.preventDefault(); handleCheckout('SETTLE'); }
      if (e.key === 'F4') { e.preventDefault(); if (!checkPosAccess('OrderWindow', 'enable_save_settle')) { toast.warning('Save bill is restricted'); return; } handleCheckout('SAVE'); }`;
modified = replaceRegex('Keyboard Shortcuts Gating', kbRegex, kbReplacement) || modified;

// 2. handleCheckout top checks
const checkoutTopRegex = /(const handleCheckout = async \([^)]*\) => \{\r?\n\s*if \(isCheckingOut\) \{\r?\n\s*console\.warn\("Checkout already in progress, ignoring double click\."\);\r?\n\s*return;\r?\n\s*\})/;
const checkoutTopReplacement = `$1
    if (type === 'SAVE' && !checkPosAccess('OrderWindow', 'enable_save_settle')) {
      toast.error("Save Bill action is restricted!");
      return;
    }
    if (type === 'PRINT' && !checkPosAccess('OrderWindow', 'enable_print_settle')) {
      toast.error("Print & Save action is restricted!");
      return;
    }`;
modified = replaceRegex('handleCheckout Top Checks', checkoutTopRegex, checkoutTopReplacement) || modified;

// 3. Combined View Department Tabs & Table Grid filtering
const combinedDeptTabRegex = /\{departments\.map\(dept => \(\r?\n\s*<button key=\{dept\} onClick=\{\(\) => setActiveDepartment\(dept\)\}/;
const combinedDeptTabReplacement = `{getAllowedDepartments().map(dept => (
                                    <button key={dept} onClick={() => setActiveDepartment(dept)}`;
modified = replaceRegex('Combined Dept Tabs', combinedDeptTabRegex, combinedDeptTabReplacement) || modified;

// 4. Separate View Department Tabs & Table Grid filtering
const separateDeptTabRegex = /\{departments\.map\(dept => \(\r?\n\s*<button key=\{dept\} onClick=\{\(\) => setActiveDepartment\(dept\)\}\s*className=\{\`px-4 py-1\.5/;
const separateDeptTabReplacement = `{getAllowedDepartments().map(dept => (
                                <button key={dept} onClick={() => setActiveDepartment(dept)}
                                className={\`px-4 py-1.5`;
modified = replaceRegex('Separate Dept Tabs', separateDeptTabRegex, separateDeptTabReplacement) || modified;

// Global Tables Filter
const globalTablesFilterTarget = `(activeDepartment === 'All' || t.department_name === activeDepartment) && (tableSearchQuery ? t.table_name.toLowerCase().includes(tableSearchQuery.toLowerCase()) : true)`;
const globalTablesFilterReplace = `isTableDepartmentAllowed(t.department_name) && (activeDepartment === 'All' || t.department_name === activeDepartment) && (tableSearchQuery ? t.table_name.toLowerCase().includes(tableSearchQuery.toLowerCase()) : true)`;
if (content.includes(globalTablesFilterTarget)) {
  console.log('[SUCCESS] Replaced global tables filtering');
  content = content.split(globalTablesFilterTarget).join(globalTablesFilterReplace);
  modified = true;
} else {
  console.error('[ERROR] Could not find global tables filtering target!');
}

// 5 & 6. Combined & Separate View Search Bar inputs (Split/Join logic)
const searchBarParts = content.split('{/* Search Bar */}');
if (searchBarParts.length >= 3) {
  console.log('[SUCCESS] Split content by {/* Search Bar */} successfully');
  
  // Modifying Combined View Search Bar (searchBarParts[1])
  let part1 = searchBarParts[1];
  part1 = part1.replace(
    /(<input[^>]*placeholder="Search Table"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'search_table') && ($1)}`
  );
  part1 = part1.replace(
    /(<input[^>]*placeholder="Search by Code"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'search_by_code') && ($1)}`
  );
  part1 = part1.replace(
    /(<div className="flex-1 relative">[\s\S]*?<Search size=\{14\}[\s\S]*?<\/div>)/,
    `{checkPosAccess('OrderWindow', 'search_by_name') && ($1)}`
  );
  part1 = part1.replace(
    /(<input[^>]*placeholder="Delete"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'delete_search') && ($1)}`
  );
  searchBarParts[1] = part1;

  // Modifying Separate View Search Bar (searchBarParts[2])
  let part2 = searchBarParts[2];
  part2 = part2.replace(
    /(<input[^>]*placeholder="Search Table"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'search_table') && ($1)}`
  );
  part2 = part2.replace(
    /(<input[^>]*placeholder="Search by Code"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'search_by_code') && ($1)}`
  );
  part2 = part2.replace(
    /(<div className="flex-1 relative">[\s\S]*?<Search size=\{14\}[\s\S]*?<\/div>)/,
    `{checkPosAccess('OrderWindow', 'search_by_name') && ($1)}`
  );
  part2 = part2.replace(
    /(<input[^>]*placeholder="Delete"[\s\S]*?\/>)/,
    `{checkPosAccess('OrderWindow', 'delete_search') && ($1)}`
  );
  searchBarParts[2] = part2;

  content = searchBarParts.join('{/* Search Bar */}');
  modified = true;
} else {
  console.error('[ERROR] Could not find at least two {/* Search Bar */} comments!');
}

// 7. Category and Catalog filtering in Combined and Separate Views
const categoriesTarget = `{categories.filter(c => c !== 'All').map(cat => (`;
const categoriesReplace = `{getAllowedCategories().filter(c => c !== 'All').map(cat => (`;
if (content.includes(categoriesTarget)) {
  console.log('[SUCCESS] Replaced global categories map');
  content = content.split(categoriesTarget).join(categoriesReplace);
  modified = true;
} else {
  console.error('[ERROR] Could not find global categories map target!');
}

const catalogFilterTarget = `.filter(i => selectedCategory === 'All' || i.category === selectedCategory)`;
const catalogFilterReplace = `.filter(i => isItemCategoryAllowed(i.category) && (selectedCategory === 'All' ? isItemCategoryAllowed(i.category) : i.category === selectedCategory))`;
if (content.includes(catalogFilterTarget)) {
  console.log('[SUCCESS] Replaced global catalog filter');
  content = content.split(catalogFilterTarget).join(catalogFilterReplace);
  modified = true;
} else {
  console.error('[ERROR] Could not find global catalog filter target!');
}

// 8. Save Bill & Print Save Buttons in Footer
const saveBillRegex = /(!posSettings\.disableSaveBill && \(\r?\n\s*<button[\s\S]+?onClick=\{\(\) => handleCheckout\('SAVE'\)\}[\s\S]+?<\/button>\r?\n\s*\))/;
const saveBillReplacement = `!posSettings.disableSaveBill && checkPosAccess('OrderWindow', 'enable_save_settle') && (
                          <button 
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('SAVE')} 
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Save Bill
                          </button>
                        )`;
modified = replaceRegex('Save Bill Button Gating', saveBillRegex, saveBillReplacement) || modified;

const printSaveRegex = /(<button\s+disabled=\{isCheckingOut\}\s*onClick=\{\(\) => handleCheckout\('PRINT'\)\}[\s\S]+?<\/button>)/;
const printSaveReplacement = `{checkPosAccess('OrderWindow', 'enable_print_settle') && (
                        $1
                      )}`;
modified = replaceRegex('Print & Save Button Gating', printSaveRegex, printSaveReplacement) || modified;

// 9. Receipts Page Sync Bills Buttons
const receiptsSyncRegex = /(<button\s+onClick=\{handleSyncBills\}[\s\S]+?<\/button>\s*<button\s+onClick=\{handleReSyncBills\}[\s\S]+?<\/button>)/;
const receiptsSyncReplacement = `{checkPosAccess('OrderWindow', 'sync_button') && (
                    <>
                      $1
                    </>
                  )}`;
modified = replaceRegex('Receipts Page Sync Buttons Gating', receiptsSyncRegex, receiptsSyncReplacement) || modified;

// 10. Table Context Menu Reservation Status Option
const tableReservationRegex = /\{\s*label:\s*'Reserved',\s*status:\s*'RESERVED',\s*color:\s*'#ffb142'\s*\}/;
const tableReservationReplacement = `...(checkPosAccess('OrderWindow', 'table_reservation') ? [{ label: 'Reserved', status: 'RESERVED', color: '#ffb142' }] : [])`;
modified = replaceRegex('Table Context Menu Reservation Gating', tableReservationRegex, tableReservationReplacement) || modified;

// 11. Local Item Config Form - Price and Stock Inputs
const localItemFormRegex = /(\{\/\* Base Price \*\/\}[\s\S]+?type="number"[\s\S]+?value=\{itemMgmtForm\.price\}[\s\S]+?\{\/\* Stock \*\/\}[\s\S]+?type="number"[\s\S]+?value=\{itemMgmtForm\.current_stock\}[\s\S]+?<\/div>)/;
const localItemFormReplacement = `{/* Base Price */}
                              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                                 <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Base Price ({config.currency}) *</label>
                                 <input
                                    type="number"
                                    step="any"
                                    required
                                    disabled={!checkPosAccess('OrderWindow', 'change_item_price')}
                                    value={itemMgmtForm.price}
                                    onChange={(e) => setItemMgmtForm(prev => ({ ...prev, price: e.target.value }))}
                                    className={\`px-3 py-2 rounded-lg text-[10px] font-mono border focus:outline-none focus:border-[#10ac84] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-300 text-slate-900'} \${!checkPosAccess('OrderWindow', 'change_item_price') ? 'opacity-50 cursor-not-allowed' : ''}\`}
                                 />
                              </div>

                              {/* Stock */}
                              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                                 <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">Initial Stock Qty</label>
                                 <input
                                    type="number"
                                    disabled={!checkPosAccess('OrderWindow', 'update_stock')}
                                    value={itemMgmtForm.current_stock}
                                    onChange={(e) => setItemMgmtForm(prev => ({ ...prev, current_stock: e.target.value }))}
                                    className={\`px-3 py-2 rounded-lg text-[10px] font-mono border focus:outline-none focus:border-[#10ac84] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-300 text-slate-900'} \${!checkPosAccess('OrderWindow', 'update_stock') ? 'opacity-50 cursor-not-allowed' : ''}\`}
                                 />
                              </div>`;
modified = replaceRegex('Local Item Price/Stock Gating', localItemFormRegex, localItemFormReplacement) || modified;


if (modified) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('App.jsx modified successfully!');
} else {
  console.error('No changes were made!');
}

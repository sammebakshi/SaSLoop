const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `                                     [
                                        { key: 'showBillDetailsOnTable', label: 'Show bill details on table' },
                                        { key: 'showItemsDetails', label: 'Show items details' },
                                        { key: 'showItemsCodeDetails', label: 'Show items code details' },
                                        { key: 'tableNameAsCustomerName', label: 'Table name as customer name for Pickup and Delivery' },
                                        { key: 'showOrderStatusOnTable', label: 'Show order status on table' },
                                        { key: 'showKOTNoOnTable', label: 'Show KOT no placed on table' },
                                        { key: 'showItemsPrepTime', label: 'Show items prep time' },
                                        { key: 'disableSaveKOT', label: 'Show Save KOT Button' },
                                        { key: 'disableSaveBill', label: 'Show Save Bill Button' },
                                        { key: 'displayTimeOnTable', label: 'Display time on table' },
                                        { key: 'showItemImage', label: 'Show item image' },
                                        { key: 'showPreOrderDateFilter', label: 'Show Pre-Order date filter' },
                                        { key: 'showTableDepartments', label: 'Show table departments' },
                                        { key: 'showCompactItemView', label: 'Show Compact Item View' }
                                        </label>
                                     ))}`;

const replacementStr = `                                     [
                                        { key: 'showBillDetailsOnTable', label: 'Show bill details on table' },
                                        { key: 'showItemsDetails', label: 'Show items details' },
                                        { key: 'showItemsCodeDetails', label: 'Show items code details' },
                                        { key: 'tableNameAsCustomerName', label: 'Table name as customer name for Pickup and Delivery' },
                                        { key: 'showOrderStatusOnTable', label: 'Show order status on table' },
                                        { key: 'showKOTNoOnTable', label: 'Show KOT no placed on table' },
                                        { key: 'showItemsPrepTime', label: 'Show items prep time' },
                                        { key: 'disableSaveKOT', label: 'Show Save KOT Button' },
                                        { key: 'disableSaveBill', label: 'Show Save Bill Button' },
                                        { key: 'displayTimeOnTable', label: 'Display time on table' },
                                        { key: 'showItemImage', label: 'Show item image' },
                                        { key: 'showPreOrderDateFilter', label: 'Show Pre-Order date filter' },
                                        { key: 'showTableDepartments', label: 'Show table departments' },
                                        { key: 'showCompactItemView', label: 'Show Compact Item View' }
                                     ].map(item => {
                                        const isInverted = item.key === 'disableSaveKOT' || item.key === 'disableSaveBill';
                                        const isChecked = isInverted ? !posSettings[item.key] : !!posSettings[item.key];
                                        return (
                                           <label key={item.key} className="flex items-center gap-2 cursor-pointer select-none">
                                              <input
                                                 type="checkbox"
                                                 checked={isChecked}
                                                 onChange={e => setPosSettings(prev => ({ ...prev, [item.key]: isInverted ? !e.target.checked : e.target.checked }))}
                                                 className="w-4 h-4 rounded accent-[#10ac84]"
                                              />
                                              <span className={`text-[10px] font-bold \${isDark ? 'text-[#c9d1d9]' : 'text-slate-700'}`}>{item.label}</span>
                                           </label>
                                        );
                                     })`;

// Replace targetStr, accounting for Windows CRLF/LF endings
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementStr.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
    const fixedContent = normalizedContent.replace(normalizedTarget, normalizedReplacement);
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log("SUCCESS: Settings checkboxes mapping fixed in App.jsx");
} else {
    console.log("ERROR: Target string not found in App.jsx");
    // Fallback search
    console.log("Let's print substring around the target area:");
    const idx = content.indexOf('showCompactItemView');
    if (idx !== -1) {
        console.log(content.substring(idx - 100, idx + 400));
    }
}

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

const matchIndex = content.indexOf('Items Management</h4>');
if (matchIndex === -1) {
    console.error("❌ 'Items Management' header not found!");
    process.exit(1);
}

const buttonCloseIndex = content.indexOf('</button>', matchIndex);
if (buttonCloseIndex === -1) {
    console.error("❌ Closing </button> not found after header!");
    process.exit(1);
}

const insertIndex = buttonCloseIndex + '</button>'.length;

const buttonText = `
                     <button 
                        onClick={() => {
                           if (window.confirm("Are you sure you want to clear all local sales and customer data? This will wipe unsynced sales and local settings cache.")) {
                              const keysToClear = [
                                'pos_local_orders',
                                'pos_customer_db',
                                'pos_table_bills',
                                'pos_table_statuses',
                                'pos_table_bill_numbers',
                                'pos_table_active_timestamps',
                                'pos_dinein_cart',
                                'pos_pickup_cart',
                                'pos_quick_cart',
                                'pos_preorder_cart',
                                'pos_table_carts',
                                'pos_kot_history',
                                'pos_table_waiters',
                                'pos_table_discounts',
                                'pos_table_additional_charges',
                                'pos_expenses'
                              ];
                              keysToClear.forEach(k => localStorage.removeItem(k));
                              toast.success("Local sales and customer data cleared!");
                              setTimeout(() => window.location.reload(), 1000);
                           }
                        }}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-red-600 transition-all group"
                     >
                        <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                           <Trash2 size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Clear Local POS Data</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">Wipe local sales, tables and customer cache.</p>
                     </button>`;

const newContent = content.slice(0, insertIndex) + buttonText + content.slice(insertIndex);
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("✅ Successfully edited App.jsx dynamically!");

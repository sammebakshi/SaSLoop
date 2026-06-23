const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let isUtf16 = false;

if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
  isUtf16 = true;
}

// Normalize line endings to \n for matching
let normalized = content.replace(/\r\n/g, '\n');

// Exact block we want to match and relocate
const toolbarBlock = `                          {/* Top Action Bar */}
                          <div className={\`h-11 border-b flex items-center px-3 gap-2 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button 
                              onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                              className={\`h-8 w-8 flex items-center justify-center transition-colors shrink-0 \${
                                isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }\`}
                              title="View Menu"
                            >
                              <LayoutGrid size={20}/>
                            </button>
                            <div className="flex-1 flex justify-center gap-2">
                              {[
                                { label: 'Filter tables', onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Change Table', onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
                                { label: 'Refresh', onClick: localRefresh, show: true },
                                { label: 'Load Menu', onClick: handleSyncRefresh, show: true }
                              ].filter(btn => btn.show).map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-8 px-4 bg-[#1c2438] hover:bg-[#25304e] text-white rounded-lg text-[11.5px] font-bold flex items-center justify-center transition-all shrink-0">
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={20}/></button>
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={20}/></button>
                              <div className="relative flex items-center justify-center">
                                <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={20}/></button>
                                <span className="absolute -top-0.5 -left-1 bg-red-500 text-[6px] text-white px-1.5 py-0.5 rounded shadow-sm font-black tracking-wider leading-none scale-75 origin-top-left">
                                  LIVE
                                </span>
                              </div>
                            </div>
                          </div>`;

// Verify if the toolbarBlock exists in the normalized content
if (normalized.includes(toolbarBlock)) {
  // 1. Remove the toolbarBlock from the top
  normalized = normalized.replace(toolbarBlock, '');
  console.log('SUCCESS: Removed top Action Bar from table layout');
  
  // 2. Insert it at the bottom, just before the closing tag of billingView === 'tables' view
  const targetBottom = `                            {renderPreOrderTempTables()}
                          </div>`;
                          
  const replacementBottom = `                            {renderPreOrderTempTables()}
                          </div>

                          {/* Bottom Action Bar */}
                          <div className={\`h-11 border-t flex items-center px-3 gap-2 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button 
                              onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                              className={\`h-8 w-8 flex items-center justify-center transition-colors shrink-0 \${
                                isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }\`}
                              title="View Menu"
                            >
                              <LayoutGrid size={20}/>
                            </button>
                            <div className="flex-1 flex justify-center gap-2">
                              {[
                                { label: 'Filter tables', onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Change Table', onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
                                { label: 'Refresh', onClick: localRefresh, show: true },
                                { label: 'Load Menu', onClick: handleSyncRefresh, show: true }
                              ].filter(btn => btn.show).map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-8 px-4 bg-[#1c2438] hover:bg-[#25304e] text-white rounded-lg text-[11.5px] font-bold flex items-center justify-center transition-all shrink-0">
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={20}/></button>
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={20}/></button>
                              <div className="relative flex items-center justify-center">
                                <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={20}/></button>
                                <span className="absolute -top-0.5 -left-1 bg-red-500 text-[6px] text-white px-1.5 py-0.5 rounded shadow-sm font-black tracking-wider leading-none scale-75 origin-top-left">
                                  LIVE
                                </span>
                              </div>
                            </div>
                          </div>`;

  if (normalized.includes(targetBottom)) {
    normalized = normalized.replace(targetBottom, replacementBottom);
    console.log('SUCCESS: Inserted Action Bar at bottom');
  } else {
    console.log('ERROR: targetBottom not found in file');
  }
} else {
  console.log('ERROR: toolbarBlock not found in normalized content');
}

// Convert back to CRLF
let finalContent = normalized.replace(/\n/g, '\r\n');

if (isUtf16) {
  fs.writeFileSync(filePath, finalContent, 'utf16le');
} else {
  fs.writeFileSync(filePath, finalContent, 'utf8');
}
console.log('App.jsx modified successfully!');

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

// 1. Target Menu Action Bar (when billingView !== 'tables')
const targetMenuToolbar = `                  {/* Action Toolbar - shown at TOP only when NOT in table view */}
                  {billingView !== 'tables' && (
                    <div className={\`h-10 border-b flex items-center px-2 gap-1.5 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                      <button 
                        onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                        className={\`h-7 w-7 rounded flex items-center justify-center transition-colors shrink-0 \${
                          isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                        }\`}
                        title="View Table Layout"
                      >
                        <LayoutGrid size={14}/>
                      </button>
                      <div className="flex-1 flex justify-center gap-1.5">
                        {[
                          { label: 'Filter Tables', icon: <Filter size={12}/>, onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh, show: true },
                          { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh, show: true },
                          { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true), show: true }
                        ].filter(btn => btn.show).map(btn => (
                          <button key={btn.label} onClick={btn.onClick} className="h-7 px-3 bg-[#1c2833] hover:bg-[#2c3e50] text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-colors shrink-0">
                            {btn.icon} {btn.label}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={14}/></button>
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={14}/></button>
                        <div className="relative">
                          <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={14}/></button>
                          <span className="absolute -top-0.5 -right-2 bg-red-500 text-[6px] text-white px-1 rounded font-black tracking-tighter uppercase leading-none scale-75 origin-top-right">
                            LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  )}`;

const replacementMenuToolbar = `                  {/* Action Toolbar - shown at TOP only when NOT in table view */}
                  {billingView !== 'tables' && (
                    <div className={\`h-11 border-b flex items-center px-3 gap-2 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                      <button 
                        onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                        className={\`h-8 w-8 flex items-center justify-center transition-colors shrink-0 \${
                          isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }\`}
                        title="View Table Layout"
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
                    </div>
                  )}`;

if (normalized.includes(targetMenuToolbar)) {
  normalized = normalized.replace(targetMenuToolbar, replacementMenuToolbar);
  console.log('SUCCESS: Polished menu Action Bar');
} else {
  console.log('WARNING: targetMenuToolbar not found');
}

// 2. Target Table Action Bar (when billingView === 'tables')
const targetTableToolbar = `                          {/* Top Action Bar */}
                          <div className={\`h-10 border-b flex items-center px-2 gap-1.5 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button 
                              onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                              className={\`h-7 w-7 rounded flex items-center justify-center transition-colors shrink-0 \${
                                isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'
                              }\`}
                              title="View Menu"
                            >
                              <LayoutGrid size={14}/>
                            </button>
                            <div className="flex-1 flex justify-center gap-1.5">
                              {[
                                { label: 'Filter tables', icon: <Filter size={12}/>, onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true), show: true },
                                { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh, show: true },
                                { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh, show: true }
                              ].filter(btn => btn.show).map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-7 px-3 bg-[#1c2833] hover:bg-[#2c3e50] text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-colors shrink-0">
                                  {btn.icon} {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={14}/></button>
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={14}/></button>
                              <div className="relative">
                                <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={14}/></button>
                                <span className="absolute -top-0.5 -right-2 bg-red-500 text-[6px] text-white px-1 rounded font-black tracking-tighter uppercase leading-none scale-75 origin-top-right">
                                  LIVE
                                </span>
                              </div>
                            </div>
                          </div>`;

const replacementTableToolbar = `                          {/* Top Action Bar */}
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

if (normalized.includes(targetTableToolbar)) {
  normalized = normalized.replace(targetTableToolbar, replacementTableToolbar);
  console.log('SUCCESS: Polished table Action Bar');
} else {
  console.log('WARNING: targetTableToolbar not found');
}

// Convert back to CRLF
let finalContent = normalized.replace(/\n/g, '\r\n');

if (isUtf16) {
  fs.writeFileSync(filePath, finalContent, 'utf16le');
} else {
  fs.writeFileSync(filePath, finalContent, 'utf8');
}
console.log('App.jsx polished successfully!');

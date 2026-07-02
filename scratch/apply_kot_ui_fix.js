const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

const uiKOTTarget = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase">Target Printer</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <select
                                                            value={kotConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'kot', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         >
                                                            <option value="">Use Default Global ({posSettings.printerName || 'Default'})</option>
                                                            {availablePrinters.map(p => (
                                                               <option key={p.id} value={p.name}>{p.name}</option>
                                                            ))}
                                                         </select>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type system printer name..."
                                                            value={kotConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'kot', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

const uiKOTReplacement = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase font-bold">Target Printers (Select Multiple)</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <div className={\`p-2.5 rounded-lg border max-h-28 overflow-y-auto space-y-1.5 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                                                            {availablePrinters.map(p => {
                                                               const isChecked = Array.isArray(kotConfig.names) 
                                                                  ? kotConfig.names.includes(p.name)
                                                                  : kotConfig.name === p.name;
                                                               return (
                                                                  <label key={p.id} className="flex items-center gap-2 text-[10px] font-black cursor-pointer select-none">
                                                                     <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={e => {
                                                                           let currentNames = Array.isArray(kotConfig.names) ? [...kotConfig.names] : (kotConfig.name ? [kotConfig.name] : []);
                                                                           if (e.target.checked) {
                                                                              if (!currentNames.includes(p.name)) currentNames.push(p.name);
                                                                           } else {
                                                                              currentNames = currentNames.filter(n => n !== p.name);
                                                                           }
                                                                           updateOrderPrinterSetting(type.key, 'kot', 'names', currentNames);
                                                                           updateOrderPrinterSetting(type.key, 'kot', 'name', currentNames[0] || '');
                                                                        }}
                                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                                                                     />
                                                                     <span className={isDark ? 'text-gray-300' : 'text-slate-700'}>{p.name}</span>
                                                                  </label>
                                                               );
                                                            })}
                                                         </div>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type printer names (comma separated)..."
                                                            value={Array.isArray(kotConfig.names) ? kotConfig.names.join(', ') : (kotConfig.name || '')}
                                                            onChange={e => {
                                                               const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                               updateOrderPrinterSetting(type.key, 'kot', 'names', names);
                                                               updateOrderPrinterSetting(type.key, 'kot', 'name', names[0] || '');
                                                            }}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

if (content.includes(uiKOTTarget)) {
  content = content.replace(uiKOTTarget, uiKOTReplacement);
  console.log("Success updating KOT UI!");
} else {
  console.error("Failed to find KOT UI target!");
}

fs.writeFileSync(filePath, content, 'utf8');

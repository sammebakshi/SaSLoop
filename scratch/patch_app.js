const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF for easier replacements, then we'll save it.
const hasCRLF = content.includes('\r\n');
if (hasCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Swap footer order in formatting tab preview
const target1 = `                                 {/* Receipt Footer Version & Thank You Greeting */}
                                 <div className="text-center text-[7px] text-[#8b949e] mb-1">
                                    {posSettings.appVersion || "SaSLoop POS Version: 19.02"}
                                 </div>
                                 <div className="text-center font-black text-[10px] tracking-wide uppercase text-inherit">
                                    {posSettings.greetingMessage || "THANK YOU! VISIT AGAIN"}
                                 </div>`;

const replacement1 = `                                 {/* Receipt Footer Version & Thank You Greeting */}
                                 <div className="text-center font-black text-[10px] tracking-wide uppercase text-inherit">
                                    {posSettings.greetingMessage || "THANK YOU! VISIT AGAIN"}
                                 </div>
                                 <div className="text-center text-[7px] text-[#8b949e] mb-1">
                                    {posSettings.appVersion || "SaSLoop POS Version: 19.02"}
                                 </div>`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log('Success: Swapped footer in formatting preview.');
} else {
  console.log('Error: Target 1 not found.');
}

// 2. Update QR label and swap footer order in main receipt preview
const target2 = `<div className="font-bold text-[8.5px] mb-1 tracking-wide">SCAN TO PAY</div>`;
const replacement2 = `<div className="font-bold text-[8.5px] mb-1 tracking-wide">{previewQrMeta?.upiId === 'google_review' ? 'SCAN TO REVIEW' : 'SCAN TO PAY'}</div>`;

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
  console.log('Success: Updated QR label in main receipt preview.');
} else {
  console.log('Error: Target 2 not found.');
}

const target3 = `                        {/* Version & Greeting Footer */}
                        <div className="text-center text-[7.5px] text-gray-600 mb-1">
                           {posSettings.appVersion || "SaSLoop POS Version: 19.02"}
                        </div>
                        <div className="text-center font-black text-[10px] tracking-wide uppercase mb-2">
                           {posSettings.greetingMessage || "THANK YOU! VISIT AGAIN"}
                        </div>`;

const replacement3 = `                        {/* Version & Greeting Footer */}
                        <div className="text-center font-black text-[10px] tracking-wide uppercase mb-2">
                           {posSettings.greetingMessage || "THANK YOU! VISIT AGAIN"}
                        </div>
                        <div className="text-center text-[7.5px] text-gray-600 mb-1">
                           {posSettings.appVersion || "SaSLoop POS Version: 19.02"}
                        </div>`;

if (content.includes(target3)) {
  content = content.replace(target3, replacement3);
  console.log('Success: Swapped footer in main receipt preview.');
} else {
  console.log('Error: Target 3 not found.');
}

// 3. Replace the entire Outlet Settings tab layout to remove the preview and add Google Review settings
const startMarker = `                        {settingsActiveTab === 'outlet' && (`;
const endMarker = `                        {settingsActiveTab === 'formatting' && (`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacementOutlet = `                        {settingsActiveTab === 'outlet' && (
                           <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1 no-scrollbar">
                              {/* Payment Integrations & QR */}
                              <div className={\`p-4 rounded-xl border \${isDark ? 'bg-[#161b22]/50 border-[#30363d]' : 'bg-slate-50/50 border-slate-200'} space-y-4\`}>
                                 <span className={\`text-[10px] font-black uppercase tracking-wider block \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>Payment Integrations & QR</span>
                                 
                                 {/* Receipt QR Code Option Selector */}
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-wider text-[#8b949e] ml-1">Receipt QR Code Option</label>
                                    <div className="flex gap-2">
                                       {[
                                          { id: 'none', label: 'None' },
                                          { id: 'payment', label: 'Payment QR' },
                                          { id: 'review', label: 'Google Review QR' }
                                       ].map(opt => {
                                          const isActive = opt.id === 'none'
                                             ? (!posSettings.printUpiQr && !posSettings.printReviewQr)
                                             : opt.id === 'payment'
                                                ? posSettings.printUpiQr
                                                : posSettings.printReviewQr;
                                          return (
                                             <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => {
                                                   setPosSettings(prev => ({
                                                      ...prev,
                                                      printUpiQr: opt.id === 'payment',
                                                      printReviewQr: opt.id === 'review'
                                                   }));
                                                }}
                                                className={\`flex-1 py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all \${
                                                   isActive
                                                      ? 'bg-[#238636] text-white border-[#238636]'
                                                      : isDark ? 'bg-[#161b22] border-[#30363d] text-gray-400 hover:border-gray-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                                                }\`}
                                             >
                                                {opt.label}
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>

                                 {/* UPI QR Settings (If enabled) */}
                                 {posSettings.printUpiQr && (
                                    <>
                                       {/* Centralized QRs Selection */}
                                       <div className="space-y-2.5">
                                          <label className="text-[9px] font-black uppercase tracking-wider text-[#8b949e] ml-1">Select Active QR Code</label>
                                          
                                          {backendQrs.filter(e => e.is_active).length === 0 ? (
                                             <div className={\`p-3 rounded-xl border border-dashed text-center text-[9px] font-bold \${isDark ? 'border-[#30363d] text-gray-500' : 'border-slate-200 text-slate-400'}\`}>
                                                ⚠️ No active QR Codes configured in Back Office. Configure them under "Payment Methods" in the back office.
                                             </div>
                                          ) : (
                                             <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                                {backendQrs.filter(e => e.is_active).map(entry => {
                                                   const brandColors = { paytm: '#00BAF2', phonepe: '#5F259F', gpay: '#4285F4', bhim: '#00838F', amazonpay: '#FF9900', other: '#6B7280' };
                                                   const brandNames = { paytm: 'Paytm', phonepe: 'PhonePe', gpay: 'Google Pay', bhim: 'BHIM', amazonpay: 'Amazon Pay', other: 'UPI' };
                                                   const isActive = String(posSettings.activeStaticUpiId) === String(entry.id);
                                                   const entryIsUrl = entry.upi_id.startsWith('http://') || entry.upi_id.startsWith('https://') || entry.upi_id.startsWith('upi://');
                                                   return (
                                                      <div 
                                                         key={entry.id} 
                                                         className={\`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer \${
                                                            isActive 
                                                               ? 'border-[#238636] bg-[#238636]/10' 
                                                               : isDark ? 'border-[#30363d] bg-[#161b22] hover:border-gray-500' : 'border-slate-200 bg-white hover:border-slate-400'
                                                         }\`}
                                                         onClick={() => setPosSettings(prev => ({ ...prev, activeStaticUpiId: entry.id, upiId: entry.upi_id }))}
                                                      >
                                                         <input
                                                            type="radio"
                                                            checked={isActive}
                                                            onChange={() => setPosSettings(prev => ({ ...prev, activeStaticUpiId: entry.id, upiId: entry.upi_id }))}
                                                            className="w-3.5 h-3.5 text-[#238636] focus:ring-[#238636] shrink-0"
                                                         />
                                                         <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <div 
                                                               className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-black text-[8px] shrink-0"
                                                               style={{ backgroundColor: brandColors[entry.brand] || brandColors.other }}
                                                            >
                                                               {(brandNames[entry.brand] || 'U')[0]}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                               <span className={\`text-[9px] font-black truncate \${isDark ? 'text-white' : 'text-slate-800'}\`}>{entry.name}</span>
                                                               <span className="text-[8.5px] text-[#8b949e] truncate lowercase font-mono">{entry.upi_id}</span>
                                                            </div>
                                                         </div>
                                                         <span className="text-[8px] font-bold uppercase text-[#8b949e] bg-slate-500/10 px-1.5 py-0.5 rounded">
                                                            {entryIsUrl ? 'URL' : 'VPA'}
                                                         </span>
                                                      </div>
                                                   );
                                                })}
                                             </div>
                                          )}
                                       </div>

                                       {/* Mode Select (only if selected QR is NOT a URL) */}
                                       {(() => {
                                          const selectedQr = backendQrs.find(q => String(q.id) === String(posSettings.activeStaticUpiId));
                                          const isUrl = selectedQr?.upi_id.startsWith('http://') || selectedQr?.upi_id.startsWith('https://') || selectedQr?.upi_id.startsWith('upi://');
                                          
                                          if (selectedQr && !isUrl) {
                                             return (
                                                <div className="space-y-2">
                                                   <label className="text-[9px] font-black uppercase tracking-wider text-[#8b949e] ml-1">QR Print Settings</label>
                                                   <div className="flex gap-2">
                                                      {['dynamic', 'static'].map(mode => (
                                                         <button
                                                            key={mode}
                                                            type="button"
                                                            onClick={() => setPosSettings(prev => ({ ...prev, qrMode: mode }))}
                                                            className={\`flex-1 py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all \${
                                                               posSettings.qrMode === mode
                                                                  ? 'bg-[#238636] text-white border-[#238636]'
                                                                  : isDark ? 'bg-[#161b22] border-[#30363d] text-gray-400 hover:border-gray-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                                                            }\`}
                                                         >
                                                            {mode === 'dynamic' ? '⚡ Dynamic QR (Bill Amount)' : '📌 Static QR (Fixed VPA)'}
                                                         </button>
                                                      ))}
                                                   </div>
                                                </div>
                                             );
                                          } else if (selectedQr && isUrl) {
                                             return (
                                                <div className={\`p-2.5 rounded-xl text-[8.5px] font-bold \${isDark ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}\`}>
                                                   📌 Selected QR code will print the exact payment URL. No billing amount modifier will be applied.
                                                </div>
                                             );
                                          }
                                          return null;
                                       })()}

                                       {/* Integration Mode */}
                                       <div className="flex flex-col gap-1.5">
                                          <label className="text-[9px] font-black uppercase tracking-wider text-[#8b949e] ml-1">Integration Mode</label>
                                          <select
                                             value={posSettings.upiPaymentMethod || 'direct'}
                                             onChange={e => setPosSettings(prev => ({ ...prev, upiPaymentMethod: e.target.value }))}
                                             className={\`w-full p-2.5 rounded-xl border outline-none text-[10px] font-bold transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}
                                          >
                                             <option value="direct">Direct UPI (Manual Settle)</option>
                                             <option value="gateway" disabled>Payment Gateway (Coming Soon)</option>
                                          </select>
                                       </div>
                                    </>
                                 )}

                                 {/* Google Review QR Settings (If enabled) */}
                                 {posSettings.printReviewQr && (
                                    <div className="flex flex-col gap-1.5">
                                       <label className="text-[9px] font-black uppercase tracking-wider text-[#8b949e] ml-1">Google Review URL</label>
                                       <input
                                          type="text"
                                          placeholder="e.g. https://g.page/r/your-review-id/review"
                                          value={posSettings.googleReviewUrl || ''}
                                          onChange={e => setPosSettings(prev => ({ ...prev, googleReviewUrl: e.target.value }))}
                                          className={\`w-full p-2.5 rounded-xl border outline-none text-[10px] font-bold transition-all \${
                                             isDark 
                                                ? 'bg-[#161b22] border-[#30363d] text-white focus:border-[#238636]' 
                                                : 'bg-white border-slate-200 text-slate-800 focus:border-[#238636]'
                                          }\`}
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}\n\n`;

  const newContent = content.substring(0, startIndex) + replacementOutlet + content.substring(endIndex);
  content = newContent;
  console.log('Success: Replaced Outlet Settings tab block.');
} else {
  console.log('Error: Outlet Settings tab start or end marker not found.');
}

// Convert back to CRLF if needed
if (hasCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully wrote App.jsx!');

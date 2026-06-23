const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF
content = content.replace(/\r\n/g, '\n');

// 1. Add Customer: Address Field Border
console.log('--- 1. Applying Add Customer Address Border ---');
const addressPlaceholder = 'placeholder="e.g. 123 Street Name"';
const addrIdx = content.indexOf(addressPlaceholder);
if (addrIdx !== -1) {
  const classIdx = content.indexOf('className={`', addrIdx);
  if (classIdx !== -1 && classIdx - addrIdx < 200) {
    const endClassIdx = content.indexOf('`}', classIdx);
    const classContent = content.substring(classIdx, endClassIdx);
    if (!classContent.includes('border')) {
      const updatedClassContent = classContent.replace('focus:border-[#18ba60]', 'focus:border-[#18ba60] border');
      content = content.substring(0, classIdx) + updatedClassContent + content.substring(endClassIdx);
      console.log('[SUCCESS] Added border to Address field');
    } else {
      console.log('[ALREADY DONE] Address field already has border');
    }
  } else {
    console.error('[ERROR] Could not find class string after address placeholder');
  }
} else {
  console.error('[ERROR] Could not find Address placeholder');
}

// 2. Checkout: Conditionalize local customerDb updates and remove duplicate calculation
console.log('--- 2. Applying checkout setCustomerDb conditional wrapper ---');
const oldCustomerDbBlock = `      setCustomerDb(prev => {
        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };
        const balanceChange = ((method || 'CASH').toLowerCase() === 'credit') ? -finalTotalPrice :
                               (((method || 'CASH').toLowerCase() === 'split') ? -(parseFloat(splitCreditAmount) || 0) :
                               (((method || 'CASH').toLowerCase() === 'cash' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));
        const updatedCust = {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || '',
          points: existing.points + pointsEarned - redeemedPoints,
          orders: existing.orders + 1,
          totalSpent: existing.totalSpent + total,
          balance: (existing.balance || 0) + balanceChange
        };`;

const newCustomerDbBlock = `      setCustomerDb(prev => {
        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };
        const balanceChange = ((method || 'CASH').toLowerCase() === 'credit') ? -finalTotalPrice :
                               (((method || 'CASH').toLowerCase() === 'split') ? -(parseFloat(splitCreditAmount) || 0) :
                               (((method || 'CASH').toLowerCase() === 'cash' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));
        const updatedCust = type === 'SETTLE' ? {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || '',
          points: existing.points + pointsEarned - redeemedPoints,
          orders: existing.orders + 1,
          totalSpent: existing.totalSpent + total,
          balance: (existing.balance || 0) + balanceChange
        } : {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || ''
        };`;

if (content.includes(oldCustomerDbBlock)) {
  content = content.replace(oldCustomerDbBlock, newCustomerDbBlock);
  console.log('[SUCCESS] Replaced local customerDb block successfully');
} else {
  console.error('[ERROR] Could not find the old customerDb block. Checking if already replaced...');
  if (content.includes('updatedCust = type === \'SETTLE\' ?')) {
    console.log('[ALREADY DONE] customerDb block already replaced');
  }
}

// 3. Settings Modal Container rounded-[2rem]
console.log('--- 3. Applying Settings Modal container rounded-[2rem] ---');
const settingsStart = content.indexOf('{/* SETTINGS MODAL */}');
if (settingsStart !== -1) {
  const classIdx = content.indexOf('className={`w-[820px] max-w-[95vw] max-h-[90vh] ', settingsStart);
  if (classIdx !== -1 && classIdx - settingsStart < 500) {
    const endClassIdx = content.indexOf('`}', classIdx);
    const classContent = content.substring(classIdx, endClassIdx);
    if (classContent.includes('rounded-2xl')) {
      const updatedClassContent = classContent.replace('rounded-2xl', 'rounded-[2rem]');
      content = content.substring(0, classIdx) + updatedClassContent + content.substring(endClassIdx);
      console.log('[SUCCESS] Updated Settings Modal container to rounded-[2rem]');
    } else {
      console.log('[ALREADY DONE] Settings Modal container already rounded-[2rem]');
    }
  }
}

// 4. Pay Due Modal: Standard Header
console.log('--- 4. Applying Pay Due Modal Standard Header ---');
const payDueStart = content.indexOf('isPayDueModalOpen && (() => {');
if (payDueStart !== -1) {
  const headerIdx = content.indexOf('<div className={`p-5 border-b', payDueStart);
  if (headerIdx !== -1 && headerIdx - payDueStart < 1000) {
    const endHeaderIdx = content.indexOf('</div>', headerIdx);
    if (endHeaderIdx !== -1) {
      const headerContent = content.substring(headerIdx, endHeaderIdx);
      let updatedHeader = headerContent
        .replace('p-5 border-b', 'p-6 border-b')
        .replace('text-sm font-black', 'text-xl font-black')
        .replace('size={18}', 'size={22}')
        .replace(/text-\[9px\] font-black uppercase tracking-\[0\.2em\] text-\[\#8b949e\] mt-0\.5/g, "text-[10px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-[#8b949e]' : 'text-slate-500'}")
        .replace('className="text-slate-400 hover:text-slate-200 text-sm"', "className={`p-2 hover:bg-white/10 rounded-xl transition-all text-sm ${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}");
      
      content = content.substring(0, headerIdx) + updatedHeader + content.substring(endHeaderIdx);
      console.log('[SUCCESS] Standardized Pay Due Modal Header');
    }
  }
}

// 5. Discount Modal: Standard Header
console.log('--- 5. Applying Discount Modal Standard Header ---');
const discountStart = content.indexOf('isDiscountModalOpen && (');
if (discountStart !== -1) {
  const headerIdx = content.indexOf('<div className={`p-5 flex justify-between items-center border-b', discountStart);
  if (headerIdx !== -1 && headerIdx - discountStart < 1000) {
    const endHeaderIdx = content.indexOf('</div>', headerIdx);
    if (endHeaderIdx !== -1) {
      const headerContent = content.substring(headerIdx, endHeaderIdx);
      let updatedHeader = headerContent
        .replace('p-5 flex justify-between items-center border-b', 'p-6 border-b flex justify-between items-center')
        .replace("isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'", "isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'")
        .replace('Percent size={16}', 'Percent size={18}')
        .replace('text-sm font-black', 'text-xl font-black')
        .replace(/text-\[8px\] font-black uppercase tracking-widest \$\{isDark \? 'text-gray-400' : 'text-slate-400'\}/g, "text-[10px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-[#8b949e]' : 'text-slate-500'}")
        .replace(/className=\{\`opacity-65 hover:opacity-100 text-lg font-bold transition-all p-1 rounded-full \$\{[\s\S]*?isDark \? 'hover:bg-white\/5' : 'hover:bg-slate-100'[\s\S]*?\}\`/g, "className={`p-2 hover:bg-white/10 rounded-xl transition-all text-sm ${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}");
      
      content = content.substring(0, headerIdx) + updatedHeader + content.substring(endHeaderIdx);
      console.log('[SUCCESS] Standardized Discount Modal Header');
    }
  }
}

// 6. Charges Modal: rounded-[2rem] and container color Standardize
console.log('--- 6. Applying Charges Modal rounded-[2rem] and container color ---');
const chargesStart = content.indexOf('isChargesModalOpen && (');
if (chargesStart !== -1) {
  const classIdx = content.indexOf('className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all ', chargesStart);
  if (classIdx !== -1 && classIdx - chargesStart < 500) {
    const endClassIdx = content.indexOf('`}', classIdx);
    const classContent = content.substring(classIdx, endClassIdx);
    if (classContent.includes('rounded-3xl')) {
      const updatedClassContent = classContent
        .replace('rounded-3xl', 'rounded-[2rem]')
        .replace('bg-[#161b22]', 'bg-[#0d1117]');
      content = content.substring(0, classIdx) + updatedClassContent + content.substring(endClassIdx);
      console.log('[SUCCESS] Standardized Charges Modal Container to rounded-[2rem]');
    } else {
      console.log('[ALREADY DONE] Charges Modal container already updated');
    }
  }
}

// 7. Coupon Modal: Standard Header
console.log('--- 7. Applying Coupon Modal Standard Header ---');
const couponStart = content.indexOf('isCouponModalOpen && (');
if (couponStart !== -1) {
  const headerIdx = content.indexOf('<div className={`p-5 border-b flex justify-between items-center', couponStart);
  if (headerIdx !== -1 && headerIdx - couponStart < 1000) {
    const endHeaderIdx = content.indexOf('</div>', headerIdx);
    if (endHeaderIdx !== -1) {
      const headerContent = content.substring(headerIdx, endHeaderIdx);
      let updatedHeader = headerContent
        .replace('p-5 border-b', 'p-6 border-b')
        .replace('text-sm font-bold uppercase tracking-wider', 'text-xl font-black uppercase italic tracking-tighter flex items-center gap-2')
        .replace(/className=\{\`hover:opacity-80 text-sm \$\{isDark \? 'text-\[\#8b949e\]' : 'text-slate-400'\}\`/g, "className={`p-2 hover:bg-white/10 rounded-xl transition-all text-sm ${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}");
      
      content = content.substring(0, headerIdx) + updatedHeader + content.substring(endHeaderIdx);
      console.log('[SUCCESS] Standardized Coupon Modal Header');
    }
  }
}

// 8. Split Modal: Standard Header
console.log('--- 8. Applying Split Modal Standard Header ---');
const splitStart = content.indexOf('isSplitModalOpen && (');
if (splitStart !== -1) {
  const headerIdx = content.indexOf('<div className="p-8 bg-[#1e293b] text-white flex justify-between items-center shrink-0">', splitStart);
  if (headerIdx !== -1 && headerIdx - splitStart < 1000) {
    const endHeaderIdx = content.indexOf('</div>', headerIdx);
    if (endHeaderIdx !== -1) {
      const newHeaderStr = `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'}\`}>
                        <div className="flex items-center gap-6">
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><ArrowRight className="text-emerald-500"/> Split Bill Settlement</h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Divide the check for individual payments</p>
                           </div>
                           <div className={\`flex items-center rounded-xl p-1 \${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\`}>
                              {['PORTION', 'PERCENT', 'ITEM'].map(mode => (
                                 <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSplitMode(mode)}
                                    className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
                                 >
                                    {mode} Wise
                                 </button>
                              ))}
                           </div>
                        </div>
                        <button onClick={() => setIsSplitModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>`;
      
      content = content.substring(0, headerIdx) + newHeaderStr + content.substring(endHeaderIdx);
      console.log('[SUCCESS] Standardized Split Modal Header');
    }
  }
}

// Write back with CRLF
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('--- ALL REMAINING REPLACEMENTS COMPLETED ---');

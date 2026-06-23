const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF
content = content.replace(/\r\n/g, '\n');

console.log('=== STARTING FINAL ROBUST CODE MODIFICATIONS ===');

// ==========================================================
// 1. ADD CUSTOMER MODAL INPUT BORDERS
// ==========================================================
console.log('Applying Add Customer Input Borders...');
const addCustStart = content.indexOf('isAddCustomerModalOpen && (');
if (addCustStart !== -1) {
  let searchIdx = addCustStart;
  const targetClasses = [
    { type: 'input', placeholder: 'placeholder="e.g. John Doe"' },
    { type: 'select', value: 'value={newCustomerCountryCode}' },
    { type: 'input', placeholder: 'placeholder="e.g. 9876543210"' },
    { type: 'input', placeholder: 'placeholder="e.g. 123 Street Name"' },
    { type: 'input', placeholder: 'placeholder="0"' }, // Initial Balance
    { type: 'input', placeholder: 'placeholder="0"' }  // Initial Points
  ];

  targetClasses.forEach((tgt, idx) => {
    let itemIdx = -1;
    if (tgt.placeholder) {
      itemIdx = content.indexOf(tgt.placeholder, searchIdx);
    } else if (tgt.value) {
      itemIdx = content.indexOf(tgt.value, searchIdx);
    }

    if (itemIdx !== -1) {
      const classIdx = content.indexOf('className={`', itemIdx - 300);
      if (classIdx !== -1 && Math.abs(classIdx - itemIdx) < 400) {
        const endClassIdx = content.indexOf('`}', classIdx);
        const classContent = content.substring(classIdx, endClassIdx);
        if (!classContent.includes(' border ') && !classContent.includes(' border`')) {
          const updatedClass = classContent.replace('focus:border-[#18ba60]', 'focus:border-[#18ba60] border');
          content = content.substring(0, classIdx) + updatedClass + content.substring(endClassIdx);
          console.log(`[SUCCESS] Border added to field #${idx + 1}`);
        } else {
          console.log(`[ALREADY DONE] Field #${idx + 1} already has border`);
        }
      } else {
        console.error(`[ERROR] Class name not found for field #${idx + 1}`);
      }
      searchIdx = itemIdx + 10;
    } else {
      console.error(`[ERROR] Field #${idx + 1} marker not found`);
    }
  });
} else {
  console.error('[ERROR] Could not locate isAddCustomerModalOpen && (');
}

// ==========================================================
// 2. CHECKOUT LOGIC & LOYALTY POINT SYNC
// ==========================================================
console.log('Applying Checkout Loyalty Point Sync...');

// 2.1. Move pointsEarned calculation and update newOrder payload
const handleCheckoutStart = content.indexOf('const handleCheckout = async (');
if (handleCheckoutStart !== -1) {
  const finalTotalPriceIdx = content.indexOf('finalTotalPrice = posSettings.countAdvanceInSales ? remainingBalance : grandTotal;', handleCheckoutStart);
  if (finalTotalPriceIdx !== -1) {
    const pointsEarnedCalculation = `\n    let pointsEarned = 0;
    if (type === 'SETTLE' && getLoyaltySetting('loyalty_enabled', true)) {
      const isDineIn = orderType === 'DINE_IN';
      const isPickup = orderType === 'PICKUP' && subOrderType !== 'DELIVERY';
      const isDelivery = orderType === 'DELIVERY' || (orderType === 'PICKUP' && subOrderType === 'DELIVERY');
      
      let eligible = true;
      if (isDineIn && getLoyaltySetting('loyalty_points_dinein', true) === false) eligible = false;
      if (isPickup && getLoyaltySetting('loyalty_points_pickup', true) === false) eligible = false;
      if (isDelivery && getLoyaltySetting('loyalty_points_delivery', true) === false) eligible = false;
      
      if (eligible) {
        const threshold = parseFloat(getLoyaltySetting('loyalty_bill_amount_threshold', 1000));
        const pointsAwarded = parseFloat(getLoyaltySetting('loyalty_points_earned', 100));
        const ratio = pointsAwarded / threshold;
        pointsEarned = total >= threshold ? Math.floor(total * ratio) : 0;
      }
    }`;

    // Insert pointsEarned calculation
    content = content.substring(0, finalTotalPriceIdx + 82) + pointsEarnedCalculation + content.substring(finalTotalPriceIdx + 82);
    console.log('[SUCCESS] Inserted pointsEarned calculation inside handleCheckout');

    // 2.2. Update newOrder status and points_earned properties
    const newOrderIdx = content.indexOf('const newOrder = {', finalTotalPriceIdx);
    if (newOrderIdx !== -1) {
      const statusIdx = content.indexOf("status: type === 'SAVE' ? 'PENDING' : 'COMPLETED'", newOrderIdx);
      if (statusIdx !== -1 && statusIdx - newOrderIdx < 1500) {
        content = content.substring(0, statusIdx) + "status: type === 'SETTLE' ? 'COMPLETED' : 'PENDING'" + content.substring(statusIdx + 49);
        console.log('[SUCCESS] Updated status mapping in newOrder');
      }

      const pointsEarnedIdx = content.indexOf('points_earned: 0,', newOrderIdx);
      if (pointsEarnedIdx !== -1 && pointsEarnedIdx - newOrderIdx < 2000) {
        content = content.substring(0, pointsEarnedIdx) + 'points_earned: pointsEarned,' + content.substring(pointsEarnedIdx + 17);
        console.log('[SUCCESS] Updated points_earned mapping in newOrder');
      }
    }
  }
}

// 2.3. Conditionalize local customerDb updates and remove duplicate calculation
const customerDbIdx = content.indexOf('setCustomerDb(prev => {', handleCheckoutStart);
if (customerDbIdx !== -1 && customerDbIdx - handleCheckoutStart < 25000) {
  // Let's remove duplicate pointsEarned calculation before setCustomerDb
  const letPointsEarnedIdx = content.lastIndexOf('let pointsEarned = 0;', customerDbIdx);
  if (letPointsEarnedIdx !== -1 && customerDbIdx - letPointsEarnedIdx < 2000) {
    content = content.substring(0, letPointsEarnedIdx) + content.substring(customerDbIdx);
    console.log('[SUCCESS] Removed duplicate pointsEarned local calculation');
  }

  // Update setCustomerDb to wrap in type === 'SETTLE' check
  const updatedCustomerDbIdx = content.indexOf('setCustomerDb(prev => {', handleCheckoutStart); // locate again as indexing changed
  const startUpdatedCust = content.indexOf('const updatedCust = {', updatedCustomerDbIdx);
  if (startUpdatedCust !== -1 && startUpdatedCust - updatedCustomerDbIdx < 1000) {
    const endUpdatedCust = content.indexOf('};', startUpdatedCust);
    if (endUpdatedCust !== -1 && endUpdatedCust - startUpdatedCust < 1000) {
      const replacement = `const updatedCust = type === 'SETTLE' ? {
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
      
      content = content.substring(0, startUpdatedCust) + replacement + content.substring(endUpdatedCust + 2);
      console.log('[SUCCESS] Conditionalized setCustomerDb updates inside handleCheckout');
    }
  }
}


// ==========================================================
// 3. BALANCED TAG HTML EXTRACTOR AND IN-PLACE MODAL HEADER STANDARDIZER
// ==========================================================
function extractTagBlock(source, startKeyword, searchStartPos) {
  const startIdx = source.indexOf(startKeyword, searchStartPos);
  if (startIdx === -1) return null;
  
  // Find the `<div` before the start keyword that represents the header container
  let headerDivStart = source.lastIndexOf('<div ', startIdx);
  if (headerDivStart === -1) return null;
  
  // Balance opening and closing tags to extract the exact block
  let depth = 1;
  let currentIdx = headerDivStart + 5;
  while (depth > 0 && currentIdx < source.length) {
    const nextOpen = source.indexOf('<div', currentIdx);
    const nextClose = source.indexOf('</div>', currentIdx);
    
    if (nextClose === -1) break;
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      currentIdx = nextOpen + 4;
    } else {
      depth--;
      currentIdx = nextClose + 6;
    }
  }
  
  return {
    start: headerDivStart,
    end: currentIdx,
    content: source.substring(headerDivStart, currentIdx)
  };
}

const modalConfig = [
  { name: 'isAccessLevelModalOpen', closeText: 'setIsAccessLevelModalOpen(false)' },
  { name: 'isSettingsModalOpen', closeText: 'setIsSettingsModalOpen(false)' },
  { name: 'isPaymentModalOpen', closeText: 'setIsPaymentModalOpen(false)' },
  { name: 'isPayDueModalOpen', closeText: 'setIsPayDueModalOpen(false)' },
  { name: 'isTableManagementModalOpen', closeText: 'setIsTableManagementModalOpen(false)' },
  { name: 'isUserManagementModalOpen', closeText: 'setIsUserManagementModalOpen(false)' },
  { name: 'isCaptainAppModalOpen', closeText: 'setIsCaptainAppModalOpen(false)' },
  { name: 'isFeedbackModalOpen', closeText: 'setIsFeedbackModalOpen(false)' },
  { name: 'isInventoryModalOpen', closeText: 'setIsInventoryModalOpen(false)' },
  { name: 'isReservationModalOpen', closeText: 'setIsReservationModalOpen(false)' },
  { name: 'isOldKOTModalOpen', closeText: 'setIsOldKOTModalOpen(false)' },
  { name: 'isTransferModalOpen', closeText: 'setIsTransferModalOpen(false)' },
  { name: 'isAddCustomerModalOpen', closeText: 'setIsAddCustomerModalOpen(false)' },
  { name: 'isRejectionModalOpen', closeText: 'setIsRejectionModalOpen(false)' },
  { name: 'isWaiterModalOpen', closeText: 'setIsWaiterModalOpen(false)' },
  { name: 'isRiderModalOpen', closeText: 'setIsRiderModalOpen(false)' },
  { name: 'isExpenseModalOpen', closeText: 'setIsExpenseModalOpen(false)' },
  { name: 'isOpenPriceModalOpen', closeText: 'setIsOpenPriceModalOpen(false)' },
  { name: 'isCustomerHistoryModalOpen', closeText: 'setIsCustomerHistoryModalOpen(false)' },
  { name: 'isDiscountModalOpen', closeText: 'setIsDiscountModalOpen(false)' },
  { name: 'isChargesModalOpen', closeText: 'setIsChargesModalOpen(false)' },
  { name: 'isCouponModalOpen', closeText: 'setIsCouponModalOpen(false)' },
  { name: 'isSplitModalOpen', closeText: 'setIsSplitModalOpen(false)' }
];

console.log('Standardizing Modal Headers and Container Corners...');

modalConfig.forEach(cfg => {
  // 3.1. Find the modal render start index - START FROM JSX RETURN AREA (Index 500,000+)
  let renderIdx = -1;
  let startSearch = 500000;
  while (true) {
    const tempIdx = content.indexOf(cfg.name, startSearch);
    if (tempIdx === -1) break;
    const checkSlice = content.substring(tempIdx, tempIdx + cfg.name.length + 20);
    if (checkSlice.includes('&&')) {
      renderIdx = tempIdx;
      break;
    }
    startSearch = tempIdx + 1;
  }

  if (renderIdx === -1) {
    console.error(`[ERROR] Could not find render check for: ${cfg.name}`);
    return;
  }

  // 3.2. Standardize Container rounded corners first
  // Loop through next className declarations to find the wrapper modal card and set rounded-[2rem]
  let classIdx = renderIdx;
  let containerFound = false;
  for (let i = 0; i < 3; i++) {
    classIdx = content.indexOf('className=', classIdx + 1);
    if (classIdx === -1 || classIdx - renderIdx > 2000) break;
    
    const endClassIdx = content.indexOf('}', classIdx);
    const endClassIdxQuote = content.indexOf('"', classIdx + 11);
    let endIdx = endClassIdxQuote;
    if (endClassIdx !== -1 && (endClassIdxQuote === -1 || endClassIdx < endClassIdxQuote)) {
      endIdx = endClassIdx + 1;
    } else {
      endIdx = endIdx + 1;
    }
    
    let classContent = content.substring(classIdx, endIdx);
    const oldRounded = classContent.match(/rounded-(2xl|3xl|\[2\.5rem\])/);
    if (oldRounded) {
      let updatedClassContent = classContent.replace(oldRounded[0], 'rounded-[2rem]');
      if (!updatedClassContent.includes('overflow-hidden')) {
        updatedClassContent = updatedClassContent.replace('rounded-[2rem]', 'rounded-[2rem] overflow-hidden');
      }
      content = content.substring(0, classIdx) + updatedClassContent + content.substring(endIdx);
      console.log(`[SUCCESS] Rounded [2rem] applied to ${cfg.name} container`);
      containerFound = true;
      break;
    }
  }

  // Refresh index references since content size might have changed slightly
  startSearch = 500000;
  while (true) {
    const tempIdx = content.indexOf(cfg.name, startSearch);
    if (tempIdx === -1) break;
    const checkSlice = content.substring(tempIdx, tempIdx + cfg.name.length + 20);
    if (checkSlice.includes('&&')) {
      renderIdx = tempIdx;
      break;
    }
    startSearch = tempIdx + 1;
  }

  // 3.3. Standardize Headers dynamically using balanced tag extraction
  const headerBlock = extractTagBlock(content, cfg.closeText, renderIdx);
  if (headerBlock) {
    let headerHTML = headerBlock.content;
    
    // Standardize outer div classes to: p-6 border-b flex justify-between items-center shrink-0 and theme-adaptive
    const divClassIdx = headerHTML.indexOf('className=');
    if (divClassIdx !== -1) {
      const endDivClassIdx = headerHTML.indexOf('"', divClassIdx + 11);
      const endDivClassIdx2 = headerHTML.indexOf('`}', divClassIdx + 11);
      
      let endIdx = endDivClassIdx;
      if (endDivClassIdx === -1 || (endDivClassIdx2 !== -1 && endDivClassIdx2 < endDivClassIdx)) {
        endIdx = endDivClassIdx2 + 2;
      } else {
        endIdx = endIdx + 1;
      }
      
      const oldDivClass = headerHTML.substring(divClassIdx, endIdx);
      const newDivClass = `className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}`;
      headerHTML = headerHTML.replace(oldDivClass, newDivClass);
    }

    // Standardize Title font size
    const h3ClassIdx = headerHTML.indexOf('<h3 className=');
    if (h3ClassIdx !== -1) {
      const endH3ClassIdx = headerHTML.indexOf('"', h3ClassIdx + 15);
      const endH3ClassIdx2 = headerHTML.indexOf('`}', h3ClassIdx + 15);
      
      let endIdx = endH3ClassIdx;
      if (endH3ClassIdx === -1 || (endH3ClassIdx2 !== -1 && endH3ClassIdx2 < endH3ClassIdx)) {
        endIdx = endH3ClassIdx2 + 2;
      } else {
        endIdx = endIdx + 1;
      }
      
      const oldH3Class = headerHTML.substring(h3ClassIdx, endIdx);
      const newH3Class = `<h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}`;
      headerHTML = headerHTML.replace(oldH3Class, newH3Class);
    }

    // Standardize subtitle font classes
    const pClassIdx = headerHTML.indexOf('<p className=');
    if (pClassIdx !== -1) {
      const endPClassIdx = headerHTML.indexOf('"', pClassIdx + 14);
      const endPClassIdx2 = headerHTML.indexOf('`}', pClassIdx + 14);
      
      let endIdx = endPClassIdx;
      if (endPClassIdx === -1 || (endPClassIdx2 !== -1 && endPClassIdx2 < endPClassIdx)) {
        endIdx = endPClassIdx2 + 2;
      } else {
        endIdx = endIdx + 1;
      }
      
      const oldPClass = headerHTML.substring(pClassIdx, endIdx);
      const newPClass = `<p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}`;
      headerHTML = headerHTML.replace(oldPClass, newPClass);
    }

    // Standardize close button classes and label
    const btnIdx = headerHTML.indexOf(cfg.closeText);
    if (btnIdx !== -1) {
      const btnStart = headerHTML.lastIndexOf('<button', btnIdx);
      if (btnStart !== -1) {
        const btnClassIdx = headerHTML.indexOf('className=', btnStart);
        if (btnClassIdx !== -1) {
          const endBtnClassIdx = headerHTML.indexOf('"', btnClassIdx + 11);
          const endBtnClassIdx2 = headerHTML.indexOf('`}', btnClassIdx + 11);
          
          let endIdx = endBtnClassIdx;
          if (endBtnClassIdx === -1 || (endBtnClassIdx2 !== -1 && endBtnClassIdx2 < endBtnClassIdx)) {
            endIdx = endBtnClassIdx2 + 2;
          } else {
            endIdx = endIdx + 1;
          }
          
          const oldBtnClass = headerHTML.substring(btnClassIdx, endIdx);
          const newBtnClass = `className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}`;
          headerHTML = headerHTML.replace(oldBtnClass, newBtnClass);
        }
        
        // Update text inside the button to standardised ✕
        const btnCloseTag = headerHTML.indexOf('</button>', btnStart);
        if (btnCloseTag !== -1) {
          const contentStart = headerHTML.indexOf('>', btnStart) + 1;
          const currentText = headerHTML.substring(contentStart, btnCloseTag).trim();
          if (currentText === 'X' || currentText === 'Close' || currentText === '✕') {
            headerHTML = headerHTML.substring(0, contentStart) + '✕' + headerHTML.substring(btnCloseTag);
          }
        }
      }
    }

    // Replace the old header with the standardised headerHTML
    content = content.replace(headerBlock.content, headerHTML);
    console.log(`[SUCCESS] Standardized Header for ${cfg.name}`);
  } else {
    console.error(`[ERROR] Could not extract header block for: ${cfg.name}`);
  }
});

// Write back with CRLF newlines for Windows OS
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('=== ALL FINAL ROBUST MODIFICATIONS COMPLETED ===');

const fs = require('fs');

let content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

console.log('App.jsx original length:', content.length);

// 1. Format points discount row on printed receipt
const oldPointsPrintBlock = `            \${pointsDiscountAmt ? \`
            <div class="summary-row">
              <span>Discount (Points):</span>
              <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)} (\${pointsRedeemed} pts)</span>
            </div>
            \` : ''}`;

const newPointsPrintBlock = `            \${pointsDiscountAmt ? \`
            <div class="summary-row">
              <span>Discount \${Math.floor(pointsDiscountAmt)}(\${pointsRedeemed} pts):</span>
              <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)}</span>
            </div>
            \` : ''}`;

const oldPointsPrintBlockCRLF = oldPointsPrintBlock.replace(/\n/g, '\r\n');
if (content.includes(oldPointsPrintBlock)) {
  content = content.replace(oldPointsPrintBlock, newPointsPrintBlock);
  console.log('Applied points print format (LF)');
} else if (content.includes(oldPointsPrintBlockCRLF)) {
  content = content.replace(oldPointsPrintBlockCRLF, newPointsPrintBlock.replace(/\n/g, '\r\n'));
  console.log('Applied points print format (CRLF)');
} else {
  // Direct text search & replace to be robust
  const searchPart = `<span>Discount (Points):</span>\n              <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)} (\${pointsRedeemed} pts)</span>`;
  const searchPartCRLF = searchPart.replace(/\n/g, '\r\n');
  const replacePart = `<span>Discount \${Math.floor(pointsDiscountAmt)}(\${pointsRedeemed} pts):</span>\n              <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)}`;
  
  if (content.includes(searchPart)) {
    content = content.replace(searchPart, replacePart);
    console.log('Applied points print format searchPart (LF)');
  } else if (content.includes(searchPartCRLF)) {
    content = content.replace(searchPartCRLF, replacePart.replace(/\n/g, '\r\n'));
    console.log('Applied points print format searchPart (CRLF)');
  } else {
    console.log('WARNING: oldPointsPrintBlock not found!');
  }
}

// 2. Insert Loyalty Points / Redeem Row JSX right below Customer Balance / Due Row
// Target: Customer Balance / Due Row ends with:
//                         );
//                       })()}
// We want to insert the Loyalty Points / Redeem Row right after it.
const customerDueRowEnd = `                        );
                      })()}`;

const customerDueRowEndCRLF = customerDueRowEnd.replace(/\n/g, '\r\n');

const loyaltyRowJSX = `                        );
                      })()}

                      {/* Loyalty Points / Redeem Row */}
                      {(() => {
                        const trayFullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
                        const trayCustomer = trayFullPhone ? customerDb[trayFullPhone] : null;
                        if (!trayCustomer) return null;
                        
                        const points = Number(trayCustomer.points) || 0;
                        const totals = calculateTotals();
                        
                        let estimatedPoints = 0;
                        if (getLoyaltySetting('loyalty_enabled', true)) {
                          const threshold = parseFloat(getLoyaltySetting('loyalty_bill_amount_threshold', 1000));
                          const pointsAwarded = parseFloat(getLoyaltySetting('loyalty_points_earned', 100));
                          const ratio = pointsAwarded / threshold;
                          estimatedPoints = totals.total >= threshold ? Math.floor(totals.total * ratio) : 0;
                        }
                        
                        const pointsValue = parseFloat(getLoyaltySetting('loyalty_points_value', 1)) || 1;
                        const minRedeem = parseFloat(getLoyaltySetting('min_redeem_points', 100)) || 100;
                        const maxRedeem = parseFloat(getLoyaltySetting('max_redeem_per_order', 1000)) || 1000;
                        
                        return (
                          <div className={"flex flex-col gap-1.5 p-2 rounded-lg border " + (isDark ? "bg-[#161b22]/50 border-gray-800" : "bg-slate-50 border-slate-200")}>
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="flex items-center gap-1">
                                <Award size={14} className="text-amber-500" />
                                <span>Points: <strong className="text-amber-500">{points}</strong></span>
                              </span>
                              <span className="text-gray-500">Est. Earn: <strong className="text-emerald-500">+{estimatedPoints}</strong></span>
                            </div>
                            
                            {redeemedPoints > 0 ? (
                              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md text-[9px] font-bold text-emerald-600">
                                <span>Redeemed {redeemedPoints} pts (-Rs {(redeemedPoints * pointsValue).toFixed(2)})</span>
                                <button
                                  onClick={() => setRedeemedPoints(0)}
                                  className="text-red-500 hover:text-red-600 font-bold uppercase tracking-wider text-[8px]"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              points >= minRedeem && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      const toRedeem = Math.min(points, maxRedeem);
                                      setRedeemedPoints(toRedeem);
                                      toast.success("Redeemed " + toRedeem + " loyalty points!");
                                    }}
                                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[8px] font-black uppercase tracking-wider transition-all active:scale-95 flex-1"
                                  >
                                    Redeem Max ({Math.min(points, maxRedeem)} pts)
                                  </button>
                                  <button
                                    onClick={() => {
                                      const val = prompt("Enter points to redeem (Min: " + minRedeem + ", Max: " + Math.min(points, maxRedeem) + "):");
                                      if (val !== null) {
                                        const parsed = parseInt(val);
                                        if (isNaN(parsed) || parsed < minRedeem || parsed > Math.min(points, maxRedeem)) {
                                          toast.error("Invalid points. Must be between " + minRedeem + " and " + Math.min(points, maxRedeem) + ".");
                                        } else {
                                          setRedeemedPoints(parsed);
                                          toast.success("Redeemed " + parsed + " loyalty points!");
                                        }
                                      }
                                    }}
                                    className="px-2 py-1 border border-amber-500 text-amber-500 hover:bg-amber-500/10 rounded text-[8px] font-black uppercase tracking-wider transition-all active:scale-95"
                                  >
                                    Custom
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        );
                      })()}`;

if (content.includes(customerDueRowEnd)) {
  content = content.replace(customerDueRowEnd, loyaltyRowJSX);
  console.log('Inserted Loyalty points row (LF)');
} else if (content.includes(customerDueRowEndCRLF)) {
  content = content.replace(customerDueRowEndCRLF, loyaltyRowJSX.replace(/\n/g, '\r\n'));
  console.log('Inserted Loyalty points row (CRLF)');
} else {
  console.log('WARNING: Customer balance row end not found!');
}

// 3. Update Tray Bottom Toolbar
const trayBottomToolbarTarget = `                    <div className={\`flex items-center justify-end gap-3 px-3 py-2 transition-colors border-b \${isDark ? 'border-gray-800 bg-[#161b22]' : 'border-slate-200 bg-white'}\`}>
                      <button onClick={() => setActiveTab('whatsapp')} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>
                        <Gift size={20} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setActiveTab('whatsapp')} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>
                        <Award size={20} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => { setActiveTrayTab('KOT'); setTimeout(() => document.getElementById('kot-note-input')?.focus(), 50); }} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <path d="M12 18v-6" />
                          <path d="M9 15h6" />
                        </svg>
                      </button>
                      \${activeTrayTab === 'Billing' && (
                        <button onClick={() => { setActiveTrayTab('KOT'); setTimeout(() => document.getElementById('customer-name-input')?.focus(), 50); }} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </button>
                      )}
                      <button onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>`;

const trayBottomToolbarReplacement = `                    <div className={\`flex items-center justify-end gap-3 px-3 py-2 transition-colors border-b \${isDark ? 'border-gray-800 bg-[#161b22]' : 'border-slate-200 bg-white'}\`}>
                      <button
                        onClick={() => {
                          if (!customerPhone) {
                            toast.warning('Please select a customer first to view points history.');
                          } else {
                            setIsCustomerHistoryModalOpen(true);
                          }
                        }}
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Points History"
                      >
                        <Gift size={20} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={handleOpenCouponModal}
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Apply Coupon"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                          <path d="M13 5v2" />
                          <path d="M13 17v2" />
                          <path d="M13 11v2" />
                        </svg>
                      </button>
                      <button onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}>`;

const trayBottomToolbarTargetCRLF = trayBottomToolbarTarget.replace(/\n/g, '\r\n');
if (content.includes(trayBottomToolbarTarget)) {
  content = content.replace(trayBottomToolbarTarget, trayBottomToolbarReplacement);
  console.log('Updated Tray Bottom Toolbar (LF)');
} else if (content.includes(trayBottomToolbarTargetCRLF)) {
  content = content.replace(trayBottomToolbarTargetCRLF, trayBottomToolbarReplacement.replace(/\n/g, '\r\n'));
  console.log('Updated Tray Bottom Toolbar (CRLF)');
} else {
  console.log('WARNING: trayBottomToolbarTarget not found!');
}

// 4. Coupon Selection Modal insertion before ADDITIONAL CHARGES MODAL
const chargesModalTarget = `         {/* ADDITIONAL CHARGES MODAL */}
         <AnimatePresence>
            {isChargesModalOpen && (`;

const couponModalJSX = `         {/* COUPON SELECTION MODAL */}
         <AnimatePresence>
            {isCouponModalOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
               >
                  <motion.div
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0.9, y: 20 }}
                     className={\`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}
                  >
                     {/* Header */}
                     <div className={\`p-5 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                 <path d="M13 5v2" />
                                 <path d="M13 17v2" />
                                 <path d="M13 11v2" />
                              </svg>
                           </div>
                           <div>
                              <h3 className="text-sm font-black uppercase tracking-wider">Discount Coupon</h3>
                              <p className="text-[9px] font-bold text-gray-500">Select or enter coupon code</p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsCouponModalOpen(false)}
                           className={\`w-7 h-7 rounded-lg flex items-center justify-center transition-colors \${
                              isDark ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>

                     {/* Content */}
                     <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Custom Code Input */}
                        <div className="flex gap-2">
                           <input
                              type="text"
                              placeholder="ENTER COUPON CODE"
                              value={couponCode.toUpperCase()}
                              onChange={e => setCouponCode(e.target.value.toUpperCase())}
                              className={\`flex-1 p-2.5 rounded-xl border font-bold text-xs uppercase outline-none focus:border-emerald-500 tracking-widest \${
                                 isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                              }\`}
                           />
                           <button
                              onClick={() => {
                                 const match = availableCoupons.find(c => c.coupon_code.toUpperCase() === couponCode.toUpperCase());
                                 if (match) {
                                    handleApplyCoupon(match);
                                 } else {
                                    toast.error("Invalid coupon code.");
                                 }
                              }}
                              className="px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md"
                           >
                              Apply
                           </button>
                        </div>

                        {appliedCoupon && (
                           <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600">
                              <div>
                                 <div>Code: {appliedCoupon.coupon_code}</div>
                                 <div className="text-[10px] opacity-85">Discount: Rs {appliedCoupon.amount} ({appliedCoupon.fixed_perct})</div>
                              </div>
                              <button
                                 onClick={handleRemoveCoupon}
                                 className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                              >
                                 Remove
                              </button>
                           </div>
                        )}

                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1.5 border-dashed border-gray-500/20">
                           Available Coupons
                        </div>

                        {availableCoupons.length === 0 ? (
                           <p className="text-[10px] italic text-gray-500 text-center py-4">No active coupons available.</p>
                        ) : (
                           <div className="space-y-2.5">
                              {availableCoupons.map(coupon => {
                                 const minAmt = parseFloat(coupon.applicable_order_amt || 0);
                                 return (
                                    <div
                                       key={coupon.id}
                                       onClick={() => handleApplyCoupon(coupon)}
                                       className={\`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500 flex justify-between items-center group \${
                                          isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                                       }\`}
                                    >
                                       <div>
                                          <div className="font-bold text-xs uppercase tracking-wide group-hover:text-emerald-500 transition-colors">
                                             {coupon.coupon_code}
                                          </div>
                                          <div className="text-[10px] text-gray-500 mt-0.5">
                                             Min spend: Rs {minAmt.toFixed(2)}
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <div className="font-black text-xs text-emerald-500">
                                             {coupon.fixed_perct === 'Percent' || coupon.fixed_perct === 'percent' ? \`\${coupon.amount}% OFF\` : \`Rs \${coupon.amount} OFF\`}
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                     <div className={\`p-5 flex gap-3 border-t \${
                        isDark ? 'bg-[#0d1117]/30 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }\`}>
                        <button
                           onClick={() => setIsCouponModalOpen(false)}
                           className={\`flex-1 py-3 border rounded-xl font-black uppercase text-[10px] tracking-widest transition-all \${
                              isDark
                                 ? 'border-[#30363d] text-[#c9d1d9] hover:bg-white/5'
                                 : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                           }\`}
                        >
                           Close
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* ADDITIONAL CHARGES MODAL */}
         <AnimatePresence>
            {isChargesModalOpen && (`;

const chargesModalTargetCRLF = chargesModalTarget.replace(/\n/g, '\r\n');
if (content.includes(chargesModalTarget)) {
  content = content.replace(chargesModalTarget, couponModalJSX);
  console.log('Inserted Coupon Modal (LF)');
} else if (content.includes(chargesModalTargetCRLF)) {
  content = content.replace(chargesModalTargetCRLF, couponModalJSX.replace(/\n/g, '\r\n'));
  console.log('Inserted Coupon Modal (CRLF)');
} else {
  console.log('WARNING: chargesModalTarget not found!');
}

// 5. Add coupon discount row into cart sidebar summary totals
// We can find where calculatTotals().total is rendered and render coupon and loyalty discounts above it
const subtotalCardTarget = `                      <span className="text-slate-700 dark:text-gray-300">Subtotal:</span>
                      <span className="font-black tabular-nums">{calculateTotals().subtotal.toFixed(2)}</span>`;

const subtotalCardReplacement = `                      <span className="text-slate-700 dark:text-gray-300">Subtotal:</span>
                      <span className="font-black tabular-nums">{calculateTotals().subtotal.toFixed(2)}</span>
                    </div>
                    {calculateTotals().couponDiscountAmt > 0 && (
                      <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500">
                        <span>Coupon Discount:</span>
                        <span>-Rs {calculateTotals().couponDiscountAmt.toFixed(2)}</span>
                      </div>
                    )}
                    {calculateTotals().pointsDiscountAmt > 0 && (
                      <div className="flex justify-between items-center text-[10px] font-bold text-amber-500">
                        <span>Discount {redeemedPoints}({redeemedPoints} pts):</span>
                        <span>-Rs {calculateTotals().pointsDiscountAmt.toFixed(2)}</span>
                      </div>`;

// Let's check another easier anchor for cart totals
const cartTotalLabelAnchor = `<div className="flex justify-between items-center text-[11px] font-bold mt-1">`;
const cartTotalLabelReplacement = `<div className="flex justify-between items-center text-[10px] font-bold text-emerald-500 mt-1">
                      <span>Coupon Discount:</span>
                      <span>-Rs {calculateTotals().couponDiscountAmt ? calculateTotals().couponDiscountAmt.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-amber-500 mt-1">
                      <span>Discount {Math.floor(calculateTotals().pointsDiscountAmt || 0)}({redeemedPoints} pts):</span>
                      <span>-Rs {calculateTotals().pointsDiscountAmt ? calculateTotals().pointsDiscountAmt.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold mt-1">`;

const cartTotalLabelAnchorCRLF = cartTotalLabelAnchor.replace(/\n/g, '\r\n');
if (content.includes(cartTotalLabelAnchor)) {
  content = content.replace(cartTotalLabelAnchor, cartTotalLabelReplacement);
  console.log('Inserted Coupon and Points rows in cart sidebar (LF)');
} else if (content.includes(cartTotalLabelAnchorCRLF)) {
  content = content.replace(cartTotalLabelAnchorCRLF, cartTotalLabelReplacement.replace(/\n/g, '\r\n'));
  console.log('Inserted Coupon and Points rows in cart sidebar (CRLF)');
} else {
  console.log('WARNING: cartTotalLabelAnchor not found!');
}

// 6. Insert underline Bill No title on the simulated receipt block on line 18447
const simulatorTitleTarget = `<div className="border-t border-dashed border-black/45 my-2"></div>`;
// We want to insert the title after the second border-t border-dashed inside previewReceipt block:
// Let's find:
const dateAnchor = `                             <div className="text-center text-[8px] text-gray-600 leading-snug mt-1">
                              {formatDateTime(previewReceipt.created_at || previewReceipt.timestamp)}
                           </div>
                        </div>

                        <div className="border-t border-dashed border-black/45 my-2"></div>`;

const dateAnchorReplacement = `                             <div className="text-center text-[8px] text-gray-600 leading-snug mt-1">
                              {formatDateTime(previewReceipt.created_at || previewReceipt.timestamp)}
                           </div>
                        </div>

                        <div className="border-t border-dashed border-black/45 my-2"></div>
                        <div className="text-center font-bold text-[10px] uppercase tracking-wider my-0.5 underline">
                           {previewReceipt.isBookingReceipt ? 'PRE-ORDER BOOKING RECEIPT' : previewReceipt.isSettlement ? 'PRE-ORDER INVOICE (SETTLED)' : 'BILL NO: ' + (previewReceipt.bill_no || previewReceipt.id)}
                        </div>
                        <div className="border-t border-dashed border-black/45 my-2"></div>`;

const dateAnchorCRLF = dateAnchor.replace(/\n/g, '\r\n');
if (content.includes(dateAnchor)) {
  content = content.replace(dateAnchor, dateAnchorReplacement);
  console.log('Inserted simulated receipt title (LF)');
} else if (content.includes(dateAnchorCRLF)) {
  content = content.replace(dateAnchorCRLF, dateAnchorReplacement.replace(/\n/g, '\r\n'));
  console.log('Inserted simulated receipt title (CRLF)');
} else {
  console.log('WARNING: dateAnchor not found!');
}

fs.writeFileSync('pos-app/src/App.jsx', content, 'utf8');
console.log('App.jsx phase 2 complete!');

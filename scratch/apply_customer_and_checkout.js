const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines to LF for matching
content = content.replace(/\r\n/g, '\n');

// 1. Add Customer Input borders
const findAddCustomerInputs = `                  <div className={\`p-8 space-y-4 \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer Name</label>
                        <input
                           type="text"
                           value={newCustomerForm.name}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g. John Doe"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Phone Number *</label>
                        <div className="flex gap-2">
                           <select
                              value={newCustomerCountryCode}
                              onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                              className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                           >
                              {COUNTRY_CODES.map(c => (
                                 <option key={c.code} value={c.dialCode} className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-slate-800'}>
                                    {c.flag} {c.dialCode}
                                 </option>
                              ))}
                           </select>
                           <input
                              type="text"
                              value={newCustomerForm.phone}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="e.g. 9876543210"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Address</label>
                        <input
                           type="text"
                           value={newCustomerForm.address}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                           placeholder="e.g. 123 Street Name"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Balance</label>
                           <input
                              type="number"
                              value={newCustomerForm.balance}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, balance: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>

                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Points</label>
                           <input
                              type="number"
                              value={newCustomerForm.points}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, points: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>
                  </div>`;

const replaceAddCustomerInputs = `                  <div className={\`p-8 space-y-4 \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer Name</label>
                        <input
                           type="text"
                           value={newCustomerForm.name}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g. John Doe"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Phone Number *</label>
                        <div className="flex gap-2">
                           <select
                              value={newCustomerCountryCode}
                              onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                              className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                           >
                              {COUNTRY_CODES.map(c => (
                                 <option key={c.code} value={c.dialCode} className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-slate-800'}>
                                    {c.flag} {c.dialCode}
                                 </option>
                              ))}
                           </select>
                           <input
                              type="text"
                              value={newCustomerForm.phone}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="e.g. 9876543210"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Address</label>
                        <input
                           type="text"
                           value={newCustomerForm.address}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                           placeholder="e.g. 123 Street Name"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Balance</label>
                           <input
                              type="number"
                              value={newCustomerForm.balance}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, balance: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>

                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Points</label>
                           <input
                              type="number"
                              value={newCustomerForm.points}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, points: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>
                  </div>`;

if (content.includes(findAddCustomerInputs)) {
  content = content.replace(findAddCustomerInputs, replaceAddCustomerInputs);
  console.log("Re-applied Add Customer inputs borders");
} else {
  console.error("Failed to find Add Customer inputs!");
}

// 2. handleCheckout - pointsEarned and status update
const findCheckoutTop = `    const fullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
    const newOrder = {
      id: orderId,
      source: navigator.onLine ? 'POS_WINDOWS' : 'POS_WINDOWS_OFFLINE',
      customer_name: customerName || "POS Guest",
      customer_phone: fullPhone,
      customer_number: fullPhone,
      address: customerAddress || "",
      waiter_id: selectedWaiter ? selectedWaiter.id : null,
      waiter_name: selectedWaiter ? selectedWaiter.name : null,
      items: activeCart.map(i => ({
        id: i.id,
        name: i.priceLabel ? \`\${i.product_name} (\${i.priceLabel})\` : i.product_name,
        qty: i.quantity,
        price: i.price,
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || "Main Kitchen",
        isComplementary: isFreeCheckout ? true : (i.isComplementary || false),
        isCancelled: i.isCancelled || false,
        cancelReason: i.cancelReason || ""
      })),
      subtotal,
      discount: discountAmt,
      tax_cgst: cgst,
      tax_sgst: sgst,
      delivery_charge: extraFixed,
      charge_details: appliedAdditionalCharges.map(c => ({ name: c.name, type: c.type, value: parseFloat(c.value || 0), amount: c.type === 'percent' || c.type === 'PERCENT' ? (subtotal - discountAmt) * (parseFloat(c.value || 0) / 100) : parseFloat(c.value || 0) })),
      service_charge: serviceCharge,
      total_price: finalTotalPrice,
      payment_method: isDue ? 'DUE' : method,
      reference_no: referenceNo,
      order_reference: orderId,
      tip_amount: isFreeCheckout ? 0 : (parseFloat(tip) || 0),
      status: type === 'SAVE' ? 'PENDING' : 'COMPLETED',
      table_id: (orderType === 'DINE_IN' && selectedTable && !selectedTable.is_temporary) ? selectedTable.id : null,
      order_type: (selectedTable && selectedTable.is_temporary)
        ? (selectedTable.original_order_type === 'PICKUP' ? selectedTable.original_sub_order_type : selectedTable.original_order_type)
        : (orderType === 'PICKUP' ? subOrderType : orderType),
      created_at: editingOrder ? (editingOrder.created_at || new Date().toISOString()) : new Date().toISOString(),
      bill_no: bNo,
      synced: false,
      pre_order_id: editingPreOrder ? editingPreOrder.id : null,
      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      pre_order_scheduled_date: editingPreOrder ? editingPreOrder.scheduled_date : null,
      pre_order_scheduled_time: editingPreOrder ? editingPreOrder.scheduled_time : null,
      coupon_code: appliedCoupon ? (appliedCoupon.coupon_code || appliedCoupon.code) : null,
      coupon_discount: couponDiscountAmt,
      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: 0,`;

const replaceCheckoutTop = `    const fullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';

    let pointsEarned = 0;
    if (fullPhone) {
      if (getLoyaltySetting('loyalty_enabled', true)) {
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
      } else {
        pointsEarned = 0;
      }
    }

    const newOrder = {
      id: orderId,
      source: navigator.onLine ? 'POS_WINDOWS' : 'POS_WINDOWS_OFFLINE',
      customer_name: customerName || "POS Guest",
      customer_phone: fullPhone,
      customer_number: fullPhone,
      address: customerAddress || "",
      waiter_id: selectedWaiter ? selectedWaiter.id : null,
      waiter_name: selectedWaiter ? selectedWaiter.name : null,
      items: activeCart.map(i => ({
        id: i.id,
        name: i.priceLabel ? \`\${i.product_name} (\${i.priceLabel})\` : i.product_name,
        qty: i.quantity,
        price: i.price,
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || "Main Kitchen",
        isComplementary: isFreeCheckout ? true : (i.isComplementary || false),
        isCancelled: i.isCancelled || false,
        cancelReason: i.cancelReason || ""
      })),
      subtotal,
      discount: discountAmt,
      tax_cgst: cgst,
      tax_sgst: sgst,
      delivery_charge: extraFixed,
      charge_details: appliedAdditionalCharges.map(c => ({ name: c.name, type: c.type, value: parseFloat(c.value || 0), amount: c.type === 'percent' || c.type === 'PERCENT' ? (subtotal - discountAmt) * (parseFloat(c.value || 0) / 100) : parseFloat(c.value || 0) })),
      service_charge: serviceCharge,
      total_price: finalTotalPrice,
      payment_method: isDue ? 'DUE' : method,
      reference_no: referenceNo,
      order_reference: orderId,
      tip_amount: isFreeCheckout ? 0 : (parseFloat(tip) || 0),
      status: type === 'SETTLE' ? 'COMPLETED' : 'PENDING',
      table_id: (orderType === 'DINE_IN' && selectedTable && !selectedTable.is_temporary) ? selectedTable.id : null,
      order_type: (selectedTable && selectedTable.is_temporary)
        ? (selectedTable.original_order_type === 'PICKUP' ? selectedTable.original_sub_order_type : selectedTable.original_order_type)
        : (orderType === 'PICKUP' ? subOrderType : orderType),
      created_at: editingOrder ? (editingOrder.created_at || new Date().toISOString()) : new Date().toISOString(),
      bill_no: bNo,
      synced: false,
      pre_order_id: editingPreOrder ? editingPreOrder.id : null,
      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      pre_order_scheduled_date: editingPreOrder ? editingPreOrder.scheduled_date : null,
      pre_order_scheduled_time: editingPreOrder ? editingPreOrder.scheduled_time : null,
      coupon_code: appliedCoupon ? (appliedCoupon.coupon_code || appliedCoupon.code) : null,
      coupon_discount: couponDiscountAmt,
      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: pointsEarned,`;

if (content.includes(findCheckoutTop)) {
  content = content.replace(findCheckoutTop, replaceCheckoutTop);
  console.log("Re-applied Checkout top logic");
} else {
  console.error("Failed to find Checkout top logic!");
}

// 3. handleCheckout bottom DB updates
const findCheckoutBottom = `    if (fullPhone) {
      // Auto-save/update customer in the server database
      try {
        await posService.saveCustomer({
          name: customerName || "POS Guest",
          number: fullPhone,
          address: customerAddress || ""
        });
      } catch (err) {
        console.error("Failed to sync customer details during checkout:", err);
      }

      let pointsEarned = 0;
      if (getLoyaltySetting('loyalty_enabled', true)) {
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
      } else {
        // Loyalty disabled — no points earned
        pointsEarned = 0;
      }

      setCustomerDb(prev => {
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
        };
        const nextDb = { ...prev, [fullPhone]: updatedCust };
        localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
        return nextDb;
      });
      if (historyCustomerPhone === fullPhone) {
        refreshCustomerHistory(fullPhone);
      }
    }`;

const replaceCheckoutBottom = `    if (fullPhone) {
      // Auto-save/update customer in the server database
      try {
        await posService.saveCustomer({
          name: customerName || "POS Guest",
          number: fullPhone,
          address: customerAddress || ""
        });
      } catch (err) {
        console.error("Failed to sync customer details during checkout:", err);
      }

      setCustomerDb(prev => {
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
        };
        const nextDb = { ...prev, [fullPhone]: updatedCust };
        localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
        return nextDb;
      });
      if (historyCustomerPhone === fullPhone) {
        refreshCustomerHistory(fullPhone);
      }
    }`;

if (content.includes(findCheckoutBottom)) {
  content = content.replace(findCheckoutBottom, replaceCheckoutBottom);
  console.log("Re-applied Checkout bottom logic");
} else {
  console.error("Failed to find Checkout bottom logic!");
}

// Restore CRLF for writing back
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log("Complete!");

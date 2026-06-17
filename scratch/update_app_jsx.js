const fs = require('fs');

let content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

console.log('App.jsx original length:', content.length);

// 1. Force version 1.0.1 in initialization
content = content.replace(
  /if \(!parsed\.appVersion \|\| parsed\.appVersion\.includes\('19\.02'\)\) \{([\s\S]*?)parsed\.appVersion = 'SaSLoop POS Version: 1\.0\.1';([\s\S]*?)\}/,
  'parsed.appVersion = \'SaSLoop POS Version: 1.0.1\';'
);

// 2. Table coupons state initialization
const tableWaitersTarget = 'const [tableWaiters, setTableWaiters] = useState(() => {';
const tableCouponsDecl = `  const [tableCoupons, setTableCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_table_coupons');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });
  
  const [tableWaiters, setTableWaiters] = useState(() => {`;

if (content.includes(tableWaitersTarget)) {
  content = content.replace(tableWaitersTarget, tableCouponsDecl);
  console.log('Applied table coupons state initialization');
} else {
  console.log('WARNING: tableWaitersTarget not found!');
}

// 3. Table coupons useEffect sync
const tableWaitersSync = 'useEffect(() => {\n    localStorage.setItem(\'pos_table_waiters\', JSON.stringify(tableWaiters));\n  }, [tableWaiters]);';
const tableCouponsSync = `useEffect(() => {
    localStorage.setItem('pos_table_coupons', JSON.stringify(tableCoupons));
  }, [tableCoupons]);

  useEffect(() => {
    localStorage.setItem('pos_table_waiters', JSON.stringify(tableWaiters));
  }, [tableWaiters]);`;

if (content.includes(tableWaitersSync)) {
  content = content.replace(tableWaitersSync, tableCouponsSync);
  console.log('Applied table coupons sync effect');
} else {
  // Try without CRLF \r\n
  const tableWaitersSyncLF = 'useEffect(() => {\n    localStorage.setItem(\'pos_table_waiters\', JSON.stringify(tableWaiters));\n  }, [tableWaiters]);';
  const tableWaitersSyncCRLF = 'useEffect(() => {\r\n    localStorage.setItem(\'pos_table_waiters\', JSON.stringify(tableWaiters));\r\n  }, [tableWaiters]);';
  
  if (content.includes(tableWaitersSyncCRLF)) {
    content = content.replace(tableWaitersSyncCRLF, tableCouponsSync);
    console.log('Applied table coupons sync effect (CRLF)');
  } else if (content.includes(tableWaitersSyncLF)) {
    content = content.replace(tableWaitersSyncLF, tableCouponsSync);
    console.log('Applied table coupons sync effect (LF)');
  } else {
    console.log('WARNING: tableWaitersSync not found!');
  }
}

// 4. selectPosTable modifications
const selectPosTableTarget = `    if (selectedTable) {
      setTableWaiters(prev => ({ ...prev, [selectedTable.id]: selectedWaiter }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable.id]: discount }));
      setTableAdditionalCharges(prev => ({ ...prev, [selectedTable.id]: appliedAdditionalCharges }));
    }`;

const selectPosTableReplacement = `    if (selectedTable) {
      setTableWaiters(prev => ({ ...prev, [selectedTable.id]: selectedWaiter }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable.id]: discount }));
      setTableAdditionalCharges(prev => ({ ...prev, [selectedTable.id]: appliedAdditionalCharges }));
      setTableCoupons(prev => ({ ...prev, [selectedTable.id]: appliedCoupon }));
    }`;

// Check normal and CRLF versions of selectPosTableTarget
const selectPosTableTargetCRLF = selectPosTableTarget.replace(/\n/g, '\r\n');
if (content.includes(selectPosTableTarget)) {
  content = content.replace(selectPosTableTarget, selectPosTableReplacement);
  console.log('Applied selectPosTableTarget');
} else if (content.includes(selectPosTableTargetCRLF)) {
  content = content.replace(selectPosTableTargetCRLF, selectPosTableReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied selectPosTableTarget (CRLF)');
} else {
  console.log('WARNING: selectPosTableTarget not found!');
}

const selectPosTableEnd = `    setSelectedWaiter(restoredWaiter);
    setDiscount(restoredDiscount);
    setSelectedDiscountId(restoredDiscount.id || (restoredDiscount.value ? 'custom' : null));
    setAppliedAdditionalCharges(restoredCharges);`;

const selectPosTableEndReplacement = `    setSelectedWaiter(restoredWaiter);
    setDiscount(restoredDiscount);
    setSelectedDiscountId(restoredDiscount.id || (restoredDiscount.value ? 'custom' : null));
    setAppliedAdditionalCharges(restoredCharges);
    const restoredCoupon = tableCoupons[table.id] || null;
    setAppliedCoupon(restoredCoupon);
    setCouponCode(restoredCoupon ? restoredCoupon.coupon_code : '');`;

const selectPosTableEndCRLF = selectPosTableEnd.replace(/\n/g, '\r\n');
if (content.includes(selectPosTableEnd)) {
  content = content.replace(selectPosTableEnd, selectPosTableEndReplacement);
  console.log('Applied selectPosTableEnd');
} else if (content.includes(selectPosTableEndCRLF)) {
  content = content.replace(selectPosTableEndCRLF, selectPosTableEndReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied selectPosTableEnd (CRLF)');
} else {
  console.log('WARNING: selectPosTableEnd not found!');
}

// 5. checkout cleanup
const checkoutCleanupTarget = `      setSelectedTable(null);
      setBillingView('tables');
      setEditingOrder(null);
      setSelectedWaiter(null);
    }`;

const checkoutCleanupReplacement = `      setSelectedTable(null);
      setBillingView('tables');
      setEditingOrder(null);
      setSelectedWaiter(null);
      setRedeemedPoints(0);
      setAppliedCoupon(null);
      setCouponCode('');
      setShowLoyaltyPopup(false);
    }`;

const checkoutCleanupTargetCRLF = checkoutCleanupTarget.replace(/\n/g, '\r\n');
if (content.includes(checkoutCleanupTarget)) {
  content = content.replace(checkoutCleanupTarget, checkoutCleanupReplacement);
  console.log('Applied checkoutCleanupTarget');
} else if (content.includes(checkoutCleanupTargetCRLF)) {
  content = content.replace(checkoutCleanupTargetCRLF, checkoutCleanupReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied checkoutCleanupTarget (CRLF)');
} else {
  console.log('WARNING: checkoutCleanupTarget not found!');
}

// 6. Update calculateTotals
const calculateTotalsTarget = `    const amountAfterDiscount = Math.max(0, subtotal - discountAmt);
    const taxRate = parseFloat(posSettings.taxRate || 0);`;

const calculateTotalsReplacement = `    let couponDiscountAmt = 0;
    if (appliedCoupon) {
      const val = parseFloat(appliedCoupon.amount || 0);
      if (appliedCoupon.fixed_perct === 'Percent' || appliedCoupon.fixed_perct === 'percent') {
        couponDiscountAmt = subtotal * (val / 100);
      } else {
        couponDiscountAmt = val;
      }
    }

    let pointsDiscountAmt = 0;
    if (redeemedPoints > 0) {
      const pointsValue = parseFloat(getLoyaltySetting('loyalty_points_value', 1)) || 1;
      pointsDiscountAmt = redeemedPoints * pointsValue;
    }

    const amountAfterDiscount = Math.max(0, subtotal - discountAmt - couponDiscountAmt - pointsDiscountAmt);
    const taxRate = parseFloat(posSettings.taxRate || 0);`;

const calculateTotalsTargetCRLF = calculateTotalsTarget.replace(/\n/g, '\r\n');
if (content.includes(calculateTotalsTarget)) {
  content = content.replace(calculateTotalsTarget, calculateTotalsReplacement);
  console.log('Applied calculateTotalsTarget');
} else if (content.includes(calculateTotalsTargetCRLF)) {
  content = content.replace(calculateTotalsTargetCRLF, calculateTotalsReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied calculateTotalsTarget (CRLF)');
} else {
  console.log('WARNING: calculateTotalsTarget not found!');
}

// Update return inside calculateTotals
const calculateTotalsReturnTarget = `    return {
      subtotal,
      tax,
      cgst,
      sgst,
      serviceCharge,
      total,
      extraFixed,
      discountAmt
    };`;

const calculateTotalsReturnReplacement = `    return {
      subtotal,
      tax,
      cgst,
      sgst,
      serviceCharge,
      total,
      extraFixed,
      discountAmt,
      couponDiscountAmt,
      pointsDiscountAmt
    };`;

const calculateTotalsReturnTargetCRLF = calculateTotalsReturnTarget.replace(/\n/g, '\r\n');
if (content.includes(calculateTotalsReturnTarget)) {
  content = content.replace(calculateTotalsReturnTarget, calculateTotalsReturnReplacement);
  console.log('Applied calculateTotalsReturnTarget');
} else if (content.includes(calculateTotalsReturnTargetCRLF)) {
  content = content.replace(calculateTotalsReturnTargetCRLF, calculateTotalsReturnReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied calculateTotalsReturnTarget (CRLF)');
} else {
  console.log('WARNING: calculateTotalsReturnTarget not found!');
}

// 7. Add Coupon modal triggers and handler functions
const couponLoyaltyStatesTarget = `  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showLoyaltyPopup, setShowLoyaltyPopup] = useState(false);`;

const couponLoyaltyStatesReplacement = `  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showLoyaltyPopup, setShowLoyaltyPopup] = useState(false);

  const handleApplyCoupon = (coupon) => {
    const totals = calculateTotals();
    const minAmt = parseFloat(coupon.applicable_order_amt || 0);
    if (totals.subtotal < minAmt) {
      toast.error('Coupon requires minimum spend of Rs ' + minAmt.toFixed(2));
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCode(coupon.coupon_code);
    toast.success('Coupon ' + coupon.coupon_code + ' applied successfully!');
    setIsCouponModalOpen(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info("Coupon removed.");
  };

  const handleOpenCouponModal = () => {
    setIsCouponModalOpen(true);
    posService.getCoupons(business?.user_id || business?.parent_user_id || business?.id)
      .then(res => {
        setAvailableCoupons(res.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch coupons:", err);
      });
  };`;

const couponLoyaltyStatesTargetCRLF = couponLoyaltyStatesTarget.replace(/\n/g, '\r\n');
if (content.includes(couponLoyaltyStatesTarget)) {
  content = content.replace(couponLoyaltyStatesTarget, couponLoyaltyStatesReplacement);
  console.log('Applied couponLoyaltyStatesTarget');
} else if (content.includes(couponLoyaltyStatesTargetCRLF)) {
  content = content.replace(couponLoyaltyStatesTargetCRLF, couponLoyaltyStatesReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied couponLoyaltyStatesTarget (CRLF)');
} else {
  console.log('WARNING: couponLoyaltyStatesTarget not found!');
}

// 8. Update checkouts to include coupon_discount
const checkoutCouponCodeTarget = `coupon_code: appliedCoupon ? appliedCoupon.coupon_code : null,`;
const checkoutCouponCodeReplacement = `coupon_code: appliedCoupon ? appliedCoupon.coupon_code : null,
      coupon_discount: appliedCoupon ? calculateTotals().couponDiscountAmt : 0,`;

if (content.includes(checkoutCouponCodeTarget)) {
  content = content.replace(new RegExp(checkoutCouponCodeTarget, 'g'), checkoutCouponCodeReplacement);
  console.log('Applied coupon_discount to checkout objects');
} else {
  console.log('WARNING: checkoutCouponCodeTarget not found!');
}

// 9. Update handleShowBillPreview waiter assignments
const previewWaiterTarget = `      table_id: orderType === 'DINE_IN' ? selectedTable?.id : null,
      order_type: orderType === 'PICKUP' ? subOrderType : orderType,`;

const previewWaiterReplacement = `      table_id: orderType === 'DINE_IN' ? selectedTable?.id : null,
      table_name: orderType === 'DINE_IN' ? selectedTable?.table_name : null,
      waiter_name: selectedWaiter ? selectedWaiter.name : 'Default',
      waiter_id: selectedWaiter ? selectedWaiter.id : null,
      order_type: orderType === 'PICKUP' ? subOrderType : orderType,`;

const previewWaiterTargetCRLF = previewWaiterTarget.replace(/\n/g, '\r\n');
if (content.includes(previewWaiterTarget)) {
  content = content.replace(previewWaiterTarget, previewWaiterReplacement);
  console.log('Applied previewWaiterTarget');
} else if (content.includes(previewWaiterTargetCRLF)) {
  content = content.replace(previewWaiterTargetCRLF, previewWaiterReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied previewWaiterTarget (CRLF)');
} else {
  console.log('WARNING: previewWaiterTarget not found!');
}

// 10. Update Retail Invoice string inside handlePrint
const printInvoiceTarget = `\${isBookingReceipt ? 'PRE-ORDER BOOKING RECEIPT' : isSettlement ? 'PRE-ORDER INVOICE (SETTLED)' : 'RETAIL INVOICE'}`;
const printInvoiceReplacement = `\${isBookingReceipt ? 'PRE-ORDER BOOKING RECEIPT' : isSettlement ? 'PRE-ORDER INVOICE (SETTLED)' : 'BILL NO: ' + billNoDisplay}`;

if (content.includes(printInvoiceTarget)) {
  content = content.replace(printInvoiceTarget, printInvoiceReplacement);
  console.log('Applied printInvoiceTarget');
} else {
  console.log('WARNING: printInvoiceTarget not found!');
}

// 11. Format points discount line in printed receipt (line 7295-7296)
const printPointsLineTarget = `<span>Discount (Points):</span>
            <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)} (\${pointsRedeemed} pts)</span>`;

const printPointsLineReplacement = `<span>Discount \${Math.floor(pointsDiscountAmt)}(\${pointsRedeemed} pts):</span>
            <span>-Rs \${parseFloat(pointsDiscountAmt).toFixed(2)}</span>`;

const printPointsLineTargetCRLF = printPointsLineTarget.replace(/\n/g, '\r\n');
if (content.includes(printPointsLineTarget)) {
  content = content.replace(printPointsLineTarget, printPointsLineReplacement);
  console.log('Applied printPointsLineTarget');
} else if (content.includes(printPointsLineTargetCRLF)) {
  content = content.replace(printPointsLineTargetCRLF, printPointsLineReplacement.replace(/\n/g, '\r\n'));
  console.log('Applied printPointsLineTarget (CRLF)');
} else {
  console.log('WARNING: printPointsLineTarget not found!');
}

// 12. Format points discount line in preview receipts (line 18499-18500 and 18733-18734)
const previewPointsLine1Target = `<span className="text-right flex-1 pr-2">Discount (Points):</span>
                                 <span className="w-24 text-right">-{parseFloat(previewReceipt.points_discount || 0).toFixed(posSettings.decimalPlaces || 2)} ({previewReceipt.points_redeemed || 0} pts)</span>`;

const previewPointsLine1Replacement = `<span className="text-right flex-1 pr-2">Discount {Math.floor(previewReceipt.points_discount || 0)}({previewReceipt.points_redeemed || 0} pts):</span>
                                 <span className="w-24 text-right">-{parseFloat(previewReceipt.points_discount || 0).toFixed(posSettings.decimalPlaces || 2)}</span>`;

const previewPointsLine1TargetCRLF = previewPointsLine1Target.replace(/\n/g, '\r\n');
if (content.includes(previewPointsLine1Target)) {
  content = content.replace(previewPointsLine1Target, previewPointsLine1Replacement);
  console.log('Applied previewPointsLine1Target');
} else if (content.includes(previewPointsLine1TargetCRLF)) {
  content = content.replace(previewPointsLine1TargetCRLF, previewPointsLine1Replacement.replace(/\n/g, '\r\n'));
  console.log('Applied previewPointsLine1Target (CRLF)');
} else {
  console.log('WARNING: previewPointsLine1Target not found!');
}

const previewPointsLine2Target = `<span className="text-gray-500">Points Discount:</span>
                                 <span className="font-bold">-{parseFloat(previewReceipt.points_discount).toFixed(2)} ({previewReceipt.points_redeemed || 0} pts)</span>`;

const previewPointsLine2Replacement = `<span className="text-gray-500 font-bold">Discount {Math.floor(previewReceipt.points_discount || 0)}({previewReceipt.points_redeemed || 0} pts):</span>
                                 <span className="font-bold">-{parseFloat(previewReceipt.points_discount).toFixed(2)}</span>`;

const previewPointsLine2TargetCRLF = previewPointsLine2Target.replace(/\n/g, '\r\n');
if (content.includes(previewPointsLine2Target)) {
  content = content.replace(previewPointsLine2Target, previewPointsLine2Replacement);
  console.log('Applied previewPointsLine2Target');
} else if (content.includes(previewPointsLine2TargetCRLF)) {
  content = content.replace(previewPointsLine2TargetCRLF, previewPointsLine2Replacement.replace(/\n/g, '\r\n'));
  console.log('Applied previewPointsLine2Target (CRLF)');
} else {
  console.log('WARNING: previewPointsLine2Target not found!');
}

fs.writeFileSync('pos-app/src/App.jsx', content, 'utf8');
console.log('App.jsx successfully patched!');

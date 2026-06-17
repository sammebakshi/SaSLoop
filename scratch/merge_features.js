const fs = require('fs');

let content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

// ============================================================
// 1. Add new state declarations after selectedWaiter
// ============================================================
const waiterStateTarget = `  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [tableWaiters, setTableWaiters] = useState(() => {`;

const waiterStateReplacement = `  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [tableWaiters, setTableWaiters] = useState(() => {`;

if (content.includes(waiterStateTarget)) {
  content = content.replace(waiterStateTarget, waiterStateReplacement);
  console.log('1. Added isRiderModalOpen, selectedRiderId, redeemedPoints states');
} else {
  console.log('1. SKIP: waiter state target not found');
}

// ============================================================
// 2. Add getLoyaltySetting helper after business state
// ============================================================
const businessStateEnd = `  const [searchQuery, setSearchQuery] = useState('');`;

const loyaltySettingHelper = `  const getLoyaltySetting = (key, defaultValue) => {
    if (!business) return defaultValue;
    if (business.business_details && business.business_details[key] !== undefined) {
      return business.business_details[key];
    }
    if (business[key] !== undefined) {
      return business[key];
    }
    return defaultValue;
  };

  const [searchQuery, setSearchQuery] = useState('');`;

if (content.includes(businessStateEnd)) {
  content = content.replace(businessStateEnd, loyaltySettingHelper);
  console.log('2. Added getLoyaltySetting helper function');
} else {
  console.log('2. SKIP: businessStateEnd not found');
}

// ============================================================
// 3. Add POS settings additions
// ============================================================
const settingsTarget = `      activeStaticUpiId: '',
      countAdvanceInSales: false
    };`;

const settingsReplacement = `      activeStaticUpiId: '',
      countAdvanceInSales: false,
      printCustomerCopy: true,
      printRestaurantCopy: true,
      askPasswordForTableDelete: true,
      printLoyaltyPoints: true,
      loyaltyPrintOption: 'all'
    };`;

if (content.includes(settingsTarget)) {
  content = content.replace(settingsTarget, settingsReplacement);
  console.log('3. Added POS settings (printCustomerCopy, etc.)');
} else {
  console.log('3. SKIP: settings target not found');
}

// ============================================================
// 4. Add Coupon & Loyalty state declarations
// ============================================================
const afterChargeState = `  const [customChargeType, setCustomChargeType] = useState('fixed');
  const [customChargeValue, setCustomChargeValue] = useState('');`;

const couponLoyaltyStates = `  const [customChargeType, setCustomChargeType] = useState('fixed');
  const [customChargeValue, setCustomChargeValue] = useState('');

  // Coupon & Loyalty States
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showLoyaltyPopup, setShowLoyaltyPopup] = useState(false);

  useEffect(() => {
    setShowLoyaltyPopup(false);
  }, [customerPhone]);

  useEffect(() => {
    if (!showLoyaltyPopup) return;
    const handleOutsideClick = (e) => {
      const container = document.getElementById('loyalty-popup-container');
      const button = document.getElementById('loyalty-popup-button');
      if (container && !container.contains(e.target) && button && !button.contains(e.target)) {
        setShowLoyaltyPopup(false);
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showLoyaltyPopup]);`;

if (content.includes(afterChargeState)) {
  content = content.replace(afterChargeState, couponLoyaltyStates);
  console.log('4. Added Coupon & Loyalty states and useEffects');
} else {
  console.log('4. SKIP: charge state target not found');
}

// ============================================================
// 5. Update newOrder in handleCheckout to include loyalty/coupon fields
// ============================================================
const newOrderFieldsTarget = `      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      paid_amount: method === 'SPLIT'`;

const newOrderFieldsReplacement = `      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      pre_order_scheduled_date: editingPreOrder ? editingPreOrder.scheduled_date : null,
      pre_order_scheduled_time: editingPreOrder ? editingPreOrder.scheduled_time : null,
      coupon_code: appliedCoupon ? appliedCoupon.coupon_code : null,
      points_redeemed: redeemedPoints,
      points_discount: redeemedPoints * (parseFloat(getLoyaltySetting('loyalty_points_value', 1)) || 1),
      points_earned: 0,
      rider_id: selectedRiderId || null,
      paid_amount: method === 'SPLIT'`;

if (content.includes(newOrderFieldsTarget)) {
  content = content.replace(newOrderFieldsTarget, newOrderFieldsReplacement);
  console.log('5. Added loyalty/coupon/rider fields to newOrder');
} else {
  console.log('5. SKIP: newOrder fields target not found');
}

// ============================================================
// 6. Update checkout cleanup to reset loyalty/coupon state
// ============================================================
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

if (content.includes(checkoutCleanupTarget)) {
  content = content.replace(checkoutCleanupTarget, checkoutCleanupReplacement);
  console.log('6. Added loyalty/coupon reset to checkout cleanup');
} else {
  console.log('6. SKIP: checkout cleanup target not found');
}

// ============================================================
// 7. Update handleCheckout loyalty points calculation
// ============================================================
const oldLoyaltyCalc = `      const pointsEarned = Math.floor(total / 100);
      setCustomerDb(prev => {
        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };
        const balanceChange = ((method || 'CASH').toLowerCase() === 'credit') ? -finalTotalPrice :
                              (((method || 'CASH').toLowerCase() === 'split') ? -(parseFloat(splitCreditAmount) || 0) :
                              (((method || 'CASH').toLowerCase() === 'cash' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));
        const updatedCust = {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || '',
          points: existing.points + pointsEarned,`;

const newLoyaltyCalc = `      let pointsEarned = 0;
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
        pointsEarned = Math.floor(total / 100);
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
          points: existing.points + pointsEarned - redeemedPoints,`;

if (content.includes(oldLoyaltyCalc)) {
  content = content.replace(oldLoyaltyCalc, newLoyaltyCalc);
  console.log('7. Updated handleCheckout loyalty points calculation');
} else {
  console.log('7. SKIP: old loyalty calc not found');
}

// ============================================================
// 8. Add pointsEarnedOnBill to handlePrint for loyalty receipt section
// ============================================================
const printTaxCalcTarget = `    const taxRate = parseFloat(posSettings.taxRate || 0);
    const isInclusive = posSettings.isTaxInclusive;
    let computedTax = 0;
    if (isInclusive) {
      computedTax = (subtotal - discountAmt) * (taxRate / (100 + taxRate));
    } else {
      computedTax = (subtotal - discountAmt) * (taxRate / 100);
    }`;

const printTaxCalcWithLoyalty = `    const pointsDiscountAmt = order.points_discount !== undefined ? parseFloat(order.points_discount) : 0;

    let pointsEarnedOnBill = 0;
    if (customerPhone) {
      if (order.points_earned !== undefined) {
        pointsEarnedOnBill = order.points_earned;
      } else {
        if (getLoyaltySetting('loyalty_enabled', true)) {
          const threshold = parseFloat(getLoyaltySetting('loyalty_bill_amount_threshold', 1000));
          const pointsAwarded = parseFloat(getLoyaltySetting('loyalty_points_earned', 100));
          const ratio = pointsAwarded / threshold;
          pointsEarnedOnBill = Math.floor(subtotal * ratio);
        } else {
          pointsEarnedOnBill = Math.floor(subtotal / 100);
        }
      }
    }

    const taxRate = parseFloat(posSettings.taxRate || 0);
    const isInclusive = posSettings.isTaxInclusive;
    let computedTax = 0;
    const totalDiscount = discountAmt + pointsDiscountAmt;
    if (isInclusive) {
      computedTax = (subtotal - totalDiscount) * (taxRate / (100 + taxRate));
    } else {
      computedTax = (subtotal - totalDiscount) * (taxRate / 100);
    }`;

if (content.includes(printTaxCalcTarget)) {
  content = content.replace(printTaxCalcTarget, printTaxCalcWithLoyalty);
  console.log('8. Added pointsEarnedOnBill and loyalty receipt logic to handlePrint');
} else {
  console.log('8. SKIP: print tax calc target not found');
}

fs.writeFileSync('pos-app/src/App.jsx', content, 'utf8');
console.log('\nMerge complete. Run npm run build to verify.');

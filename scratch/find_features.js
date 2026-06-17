// Find all the new features in the corrupted file that aren't in the clean one
const fs = require('fs');

const clean = fs.readFileSync('pos-app/src/App_restored.jsx', 'utf8');
const dirty = fs.readFileSync('scratch/App_corrupted_current.jsx', 'utf8');

const features = [
  'isRiderModalOpen',
  'selectedRiderId',
  'redeemedPoints',
  'pointsRatio',
  'appliedCoupon',
  'couponCode',
  'showLoyaltyPopup',
  'getLoyaltySetting',
  'points_redeemed',
  'points_discount',
  'points_earned',
  'coupon_code',
  'rider',
  'setAppliedCoupon',
  'setCouponCode',
  'setShowLoyaltyPopup',
  'setRedeemedPoints',
  'pre_order_scheduled_date',
  'pre_order_scheduled_time',
  'printCustomerCopy',
  'printRestaurantCopy',
  'printLoyaltyPoints',
  'loyaltyPrintOption',
  'askPasswordForTableDelete',
  'pointsEarnedOnBill',
  'Loyalty Points',
  'LOYALTY',
  'loyalty-popup',
  'Rider Modal',
  'rider-modal',
  'Coupon',
  'coupon-',
];

console.log("=== Feature presence in files ===\n");
features.forEach(f => {
  const inClean = clean.includes(f);
  const inDirty = dirty.includes(f);
  if (inDirty && !inClean) {
    console.log(`NEW: "${f}" - in dirty only`);
  } else if (inDirty && inClean) {
    // count occurrences
    const cleanCount = (clean.match(new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const dirtyCount = (dirty.match(new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (dirtyCount > cleanCount) {
      console.log(`MORE: "${f}" - clean:${cleanCount} dirty:${dirtyCount}`);
    }
  }
});

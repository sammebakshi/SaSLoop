const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'pos-app', 'src');
const scratchDir = __dirname;

const files = [
  path.join(srcDir, 'App.jsx'),
  path.join(scratchDir, 'App_git_staged.jsx'),
  path.join(scratchDir, 'App_staged.jsx'),
  path.join(scratchDir, 'App_reconstructed.jsx'),
  path.join(scratchDir, 'App_reconstructed_context.jsx'),
  path.join(scratchDir, 'App_reconstructed_parsed.jsx'),
  path.join(scratchDir, 'App_working_backup_v2.jsx'),
  path.join(scratchDir, 'App_backup_before_restoration.jsx')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const stats = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  console.log(`\n========================================`);
  console.log(`File: ${path.basename(filePath)} (${stats.size} bytes)`);

  // Feature 1: Logo on Top Left
  // Let's check if there's a logo image/svg in the TOP INFO BAR (custom titlebar)
  // The titlebar div starts with: TOP INFO BAR
  const titlebarIdx = content.indexOf('TOP INFO BAR');
  if (titlebarIdx > -1) {
    const titlebarBlock = content.substring(titlebarIdx, titlebarIdx + 1200);
    const hasLogoImg = titlebarBlock.includes('<img') || titlebarBlock.includes('logo') || titlebarBlock.includes('<svg');
    console.log(`- Logo in Titlebar:`, hasLogoImg);
    if (hasLogoImg) {
      console.log(`  Titlebar snippet:`, titlebarBlock.substring(0, 400).replace(/\n/g, ' '));
    }
  } else {
    console.log(`- Logo in Titlebar: TOP INFO BAR block not found`);
  }

  // Feature 2: Support Phone Number
  const phoneIdx8484 = content.indexOf('8484089744');
  const phoneIdx8494 = content.indexOf('8494089744');
  if (phoneIdx8484 > -1) console.log(`- Phone Number: 8484089744 (old)`);
  else if (phoneIdx8494 > -1) console.log(`- Phone Number: 8494089744 (fixed)`);
  else console.log(`- Phone Number: Not found`);

  // Feature 3: Quick Bill sub-tabs removed (Order/KOT and Billing tabs)
  // Let's check if the sub-tabs buttons (Order/KOT and Billing) are hidden for Quick Bill
  const hasQuickBillTabCheck = content.includes("activeTrayTab === 'Quick'") || content.includes("activeTrayTab !== 'Quick'");
  const hasSubTabsHiding = content.includes("activeTrayTab !== 'Billing'") || content.includes("activeTrayTab !== 'Quick'");
  console.log(`- Quick Bill Tab Checks:`, hasQuickBillTabCheck, `- Subtabs Hiding:`, hasSubTabsHiding);

  // Feature 4: Pre-order settings inside POS settings
  const hasPreOrderSettings = content.includes('preOrder') && content.includes('settings');
  console.log(`- Pre-order settings in settings:`, hasPreOrderSettings);

  // Feature 5: Customer Toolbar Cleanup (Removed FilePlus, replaced Ribbon/Award)
  const hasFilePlus = content.includes('FilePlus') || content.includes('Plus') && content.includes('Customer Info');
  const hasAwardIcon = content.includes('Award');
  const hasTicketIcon = content.includes('Ticket') || content.includes('coupon') || content.includes('Coupon');
  console.log(`- Replaced Award with Ticket/Coupon:`, !hasAwardIcon && hasTicketIcon, `- Has FilePlus:`, hasFilePlus);

  // Feature 6: Table icon enabled in all order types
  // Let's check where the table icon is conditionally rendered
  const hasDineInRestriction = content.includes("activeOrderType === 'DineIn'") || content.includes("activeOrderType === 'Dine In'");
  console.log(`- Table restricted to DineIn only:`, hasDineInRestriction);

  // Feature 7: Merged same items on KOT save
  const hasMergeCartItems = content.includes('mergeCartItems') || content.includes('mergeItems') || content.includes('mergedItems');
  console.log(`- Has mergeCartItems:`, hasMergeCartItems);
});

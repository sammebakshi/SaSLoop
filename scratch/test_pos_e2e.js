const puppeteer = require('puppeteer');
const path = require('path');

// Target URLs and directories
const URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/Sajad/.gemini/antigravity-ide/brain/60af18b1-1216-40e8-82c3-3dc26f3a3a60';
const SCREENSHOT_PATH = path.join(ARTIFACT_DIR, 'login_failed_toast.png');

async function run() {
  console.log("Launching browser in headless mode...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Intercept window.open and collect receipts HTML
  await page.evaluateOnNewDocument(() => {
    window.openedReceipts = [];
    window.open = (url, target, features) => {
      console.log("Mocked window.open called");
      const mockWindow = {
        document: {
          write: (html) => {
            window.openedReceipts.push(html);
          },
          close: () => {}
        },
        close: () => {},
        focus: () => {},
        print: () => {}
      };
      return mockWindow;
    };
  });

  // 2. Failed login test
  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle2' });

  console.log("Testing failed login...");
  await page.waitForSelector('input[placeholder="Operator ID or Username"]');
  await page.type('input[placeholder="Operator ID or Username"]', 'wrong_user');
  await page.type('input[placeholder="Passcode"]', 'wrong_pin');
  
  // Submit the form
  await page.click('button[type="submit"]');

  console.log("Waiting for failed login toast...");
  // Wait for the toast container or the toast itself to appear
  const toastSelector = '.Toastify__toast';
  await page.waitForSelector(toastSelector, { timeout: 10000 });

  // Verify coordinates: x near 0, y > 500
  const toastLocation = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }, toastSelector);

  console.log("Toast Location:", toastLocation);
  if (!toastLocation) {
    throw new Error("Could not find toast location");
  }

  // Assert failed login toast is bottom-left
  // Viewport is 1280x800. Bottom-left means:
  // x should be small (e.g. < 150), y should be large (e.g. > 500)
  if (toastLocation.x > 150) {
    throw new Error(`Toast is not in the bottom-left! x coordinate is ${toastLocation.x}`);
  }
  if (toastLocation.y < 450) {
    throw new Error(`Toast is not in the bottom-left! y coordinate is ${toastLocation.y}`);
  }
  console.log("✅ Failed login toast coordinates are correct!");

  // Take screenshot of the viewport and save to the artifact directory
  console.log(`Taking screenshot of failed login toast and saving to ${SCREENSHOT_PATH}...`);
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log("✅ Screenshot saved!");

  // 3. Clear/reload page to log in successfully
  console.log("Reloading page to test booking and settlement...");
  await page.reload({ waitUntil: 'networkidle2' });

  // Wait for input fields again
  await page.waitForSelector('input[placeholder="Operator ID or Username"]');
  await page.type('input[placeholder="Operator ID or Username"]', 'posuser');
  await page.type('input[placeholder="Passcode"]', 'Admin@123');
  await page.click('button[type="submit"]');

  console.log("Waiting for app main screen or Start Day operation screen...");
  await page.waitForFunction(() => {
    return document.body.textContent.includes('Start Day Operation') || document.getElementById('orderIcon') !== null;
  }, { timeout: 15000 });

  // Check if shift is NOT_STARTED and handle Terminal Closed screen
  const isTerminalClosed = await page.evaluate(() => {
    return document.body.textContent.includes('Terminal Closed');
  });

  if (isTerminalClosed) {
    console.log("Terminal Closed screen detected. Starting day operation...");
    await page.evaluate(() => {
      const input = document.querySelector('input[type="number"]');
      if (input) {
        input.value = '1000';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Start Day Operation'));
      if (btn) btn.click();
    });
    // Wait for main dashboard/order screen to load
    await page.waitForSelector('#orderIcon', { timeout: 10000 });
    console.log("✅ Day started successfully!");
  } else {
    console.log("Main screen loaded directly (day already started).");
  }

  // Go to Order/Billing tab if we are not there
  console.log("Navigating to Billing/Order view...");
  await page.click('#orderIcon');
  await page.waitForSelector('button ::-p-text(Pre Order)', { timeout: 10000 });

  // 4. Configure settings first so UPI is printed and set correctly
  console.log("Configuring UPI QR Settings...");
  await page.evaluate(() => {
    localStorage.setItem('pos_terminal_settings', JSON.stringify({
      printUpiQr: true,
      upiId: 'test@upi',
      qrMode: 'dynamic',
      separateView: true,
      address: '1st Floor Rather Plaza Kangan',
      phone: '9906495133',
      gstin: '01BNIPB3099J1Z4',
      taxName: 'GST',
      isTaxInclusive: false,
      hideTaxOnBill: false
    }));
    if (typeof window.setPosSettings === 'function') {
      window.setPosSettings(prev => ({
        ...prev,
        printUpiQr: true,
        upiId: 'test@upi',
        qrMode: 'dynamic'
      }));
    }
  });

  // Switch to Pre Order tab
  console.log("Switching to Pre Order mode...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const preOrderBtn = buttons.find(b => b.textContent.includes('Pre Order'));
    if (preOrderBtn) preOrderBtn.click();
    else throw new Error("Pre Order tab button not found");
  });

  // 5. Booking Test
  console.log("Running Pre-Order Booking Test...");
  await page.evaluate(() => {
    // Clear state just in case
    window.setCart([]);
    window.setCustomerName('John Doe');
    window.setCustomerPhone('9906112233');
    window.setCustomerAddress('Srinagar, Kashmir');
    window.setPreOrderScheduledDate('2026-06-01');
    window.setPreOrderScheduledTime('18:00');
    window.setPreOrderOrderType('PICKUP');
    
    // Find FRENCH FRIES from catalog
    const fries = window.catalog.find(item => item.product_name.toUpperCase() === 'FRENCH FRIES');
    if (!fries) throw new Error("FRENCH FRIES not found in window.catalog");
    
    // Set cart to French Fries
    window.setCart([{ ...fries, quantity: 1 }]);
    
    // Set advance amount to 50.00
    window.setPreOrderAdvanceAmount('50.00');
  });

  // Switch sub-tab to BILLING
  console.log("Switching pre-order sub-tab to BILLING...");
  await page.evaluate(() => {
    window.setPreOrderSubTab('BILLING');
  });

  // Wait for the Book Pre-Order button and click it
  console.log("Clicking 'Book Pre-Order'...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bookBtn = buttons.find(b => b.textContent.trim() === 'Book Pre-Order');
    if (bookBtn) bookBtn.click();
    else throw new Error("Book Pre-Order button not found in UI");
  });

  // Wait for receipt to be generated
  console.log("Waiting for booking receipt window.open capture...");
  await page.waitForFunction(() => {
    return window.openedReceipts && window.openedReceipts.length > 0;
  }, { timeout: 10000 });

  // Get the captured booking receipt
  const [bookingReceiptHtml] = await page.evaluate(() => {
    const r = window.openedReceipts;
    window.openedReceipts = []; // clear for next test
    return r;
  });

  console.log("Validating Booking Receipt contents...");
  if (!bookingReceiptHtml) {
    throw new Error("No booking receipt captured");
  }

  // Assert customer details, total, advance paid, remaining balance
  const customerNameCheck = bookingReceiptHtml.includes('John Doe');
  const customerPhoneCheck = bookingReceiptHtml.includes('9906112233');
  const customerAddressCheck = bookingReceiptHtml.includes('Srinagar, Kashmir');
  const bookingTitleCheck = bookingReceiptHtml.includes('PRE-ORDER BOOKING RECEIPT');
  const totalCheck = bookingReceiptHtml.includes('Grand Total:') && bookingReceiptHtml.includes('100.00');
  const advanceCheck = bookingReceiptHtml.includes('Less Advance Paid:') && bookingReceiptHtml.includes('50.00');
  const balanceCheck = bookingReceiptHtml.includes('Remaining Balance Due:') && bookingReceiptHtml.includes('50.00');

  if (!customerNameCheck || !customerPhoneCheck || !customerAddressCheck) {
    throw new Error(`Customer details missing from Booking Receipt. Check: Name=${customerNameCheck}, Phone=${customerPhoneCheck}, Address=${customerAddressCheck}`);
  }
  if (!bookingTitleCheck) {
    throw new Error("Booking receipt title 'PRE-ORDER BOOKING RECEIPT' not found");
  }
  if (!totalCheck) {
    throw new Error("Grand Total of 100.00 not found or formatted incorrectly in Booking Receipt");
  }
  if (!advanceCheck) {
    throw new Error("Less Advance Paid of 50.00 not found in Booking Receipt");
  }
  if (!balanceCheck) {
    throw new Error("Remaining Balance Due of 50.00 not found in Booking Receipt");
  }

  // Get window.lastUpiUri for booking
  const bookingUpiUri = await page.evaluate(() => window.lastUpiUri);
  console.log("Booking UPI URI:", bookingUpiUri);
  if (!bookingUpiUri || !bookingUpiUri.includes('am=50.00') || !bookingUpiUri.includes('pa=test@upi')) {
    throw new Error(`Invalid UPI URI for booking: ${bookingUpiUri}`);
  }
  console.log("✅ Booking receipt validated successfully!");

  // 6. Settlement Test
  console.log("Running Pre-Order Settlement Test...");
  // Clear states
  await page.evaluate(() => {
    window.setCart([]);
    window.setCustomerName('');
    window.setCustomerPhone('');
    window.setCustomerAddress('');
    window.setPreOrderAdvanceAmount('');
    window.setPreOrderScheduledDate('');
    window.setPreOrderScheduledTime('');
  });

  // Inject mock pre-order via window.setEditingPreOrder
  // total 200.00, advance 50.00, balance due 150.00
  await page.evaluate(() => {
    const mockPreOrder = {
      id: 9999, // dummy ID
      customer_name: 'Jane Smith',
      customer_phone: '9906445566',
      customer_number: '9906445566',
      customer_address: 'Baramulla, Kashmir',
      advance_paid: 50.00,
      balance_due: 150.00,
      total_price: 200.00,
      status: 'PENDING',
      order_type: 'PICKUP',
      created_at: new Date().toISOString()
    };

    window.setEditingPreOrder(mockPreOrder);

    // Set cart items to total 200.00 (two french fries)
    const fries = window.catalog.find(item => item.product_name.toUpperCase() === 'FRENCH FRIES');
    if (!fries) throw new Error("FRENCH FRIES not found in window.catalog");
    window.setCart([{ ...fries, quantity: 2 }]);

    // Set customer info matching pre-order
    window.setCustomerName('Jane Smith');
    window.setCustomerPhone('9906445566');
    window.setCustomerAddress('Baramulla, Kashmir');

    // Set Pre-Order Details
    window.setPreOrderScheduledDate('2026-06-02');
    window.setPreOrderScheduledTime('14:00');
    window.setPreOrderOrderType('PICKUP');

    // Switch sub-tab to BILLING
    window.setPreOrderSubTab('BILLING');
  });

  console.log("Opening Payment modal...");
  // Click Payment button to open the checkout modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const paymentBtn = buttons.find(b => b.textContent.trim() === 'Payment');
    if (paymentBtn) paymentBtn.click();
    else throw new Error("Payment button not found");
  });

  console.log("Waiting for Payment modal and Customer Paid Amount input...");
  await page.waitForSelector('input[placeholder="Amount Received"]', { timeout: 10000 });

  // Type 150.00 as Customer Paid Amount
  console.log("Entering Customer Paid Amount: 150.00...");
  await page.focus('input[placeholder="Amount Received"]');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type('input[placeholder="Amount Received"]', '150.00');

  // Click Settle Bill button
  console.log("Clicking 'Settle Bill' in Payment modal...");
  await page.evaluate(() => {
    const modal = document.querySelector('div.fixed.inset-0'); // payment modal
    if (!modal) throw new Error("Payment modal not found");
    const buttons = Array.from(modal.querySelectorAll('button'));
    const settleBtn = buttons.find(b => b.textContent.trim() === 'Settle Bill');
    if (settleBtn) settleBtn.click();
    else throw new Error("Settle Bill button in modal not found");
  });

  // Wait for receipt window.open capture
  console.log("Waiting for settlement receipt window.open capture...");
  await page.waitForFunction(() => {
    return window.openedReceipts && window.openedReceipts.length > 0;
  }, { timeout: 10000 });

  // Get the captured settlement receipt
  const [settlementReceiptHtml] = await page.evaluate(() => {
    return window.openedReceipts;
  });

  console.log("Validating Settlement Receipt contents...");
  if (!settlementReceiptHtml) {
    throw new Error("No settlement receipt captured");
  }

  // Assert receipt contains: previous advance, today's balance paid, and fully settled 0.00
  const settleTitleCheck = settlementReceiptHtml.includes('PRE-ORDER INVOICE (SETTLED)');
  const prevAdvanceCheck = settlementReceiptHtml.includes('Less Advance Paid (Prev):') && settlementReceiptHtml.includes('50.00');
  const paidTodayCheck = settlementReceiptHtml.includes('Balance Paid Today:') && settlementReceiptHtml.includes('150.00');
  const fullySettledCheck = settlementReceiptHtml.includes('Balance:') && settlementReceiptHtml.includes('0.00 (Fully Settled)');
  const nameCheck = settlementReceiptHtml.includes('Jane Smith');
  const phoneCheck = settlementReceiptHtml.includes('9906445566');

  if (!settleTitleCheck) {
    throw new Error("Settlement receipt title 'PRE-ORDER INVOICE (SETTLED)' not found");
  }
  if (!nameCheck || !phoneCheck) {
    throw new Error("Customer details missing from Settlement Receipt");
  }
  if (!prevAdvanceCheck) {
    throw new Error("Previous Advance Paid of 50.00 not found in Settlement Receipt");
  }
  if (!paidTodayCheck) {
    throw new Error("Balance Paid Today of 150.00 not found in Settlement Receipt");
  }
  if (!fullySettledCheck) {
    throw new Error("Fully Settled balance status '0.00 (Fully Settled)' not found in Settlement Receipt");
  }

  // Get window.lastUpiUri for settlement
  const settlementUpiUri = await page.evaluate(() => window.lastUpiUri);
  console.log("Settlement UPI URI:", settlementUpiUri);
  if (!settlementUpiUri || !settlementUpiUri.includes('am=150.00') || !settlementUpiUri.includes('pa=test@upi')) {
    throw new Error(`Invalid UPI URI for settlement: ${settlementUpiUri}`);
  }
  console.log("✅ Settlement receipt validated successfully!");

  console.log("🎉 All E2E POS tests passed successfully!");
  await browser.close();
}

run().catch(err => {
  console.error("❌ E2E POS test failed:", err);
  process.exit(1);
});

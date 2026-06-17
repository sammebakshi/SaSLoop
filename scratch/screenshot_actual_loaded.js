const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  // Set to mobile viewport so we can see the mobile UI layout
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  await page.goto("https://menu.tmbill.com/digimenu/838", {
    waitUntil: "networkidle2"
  });

  console.log("Clicking Pickup...");
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent === 'Pickup');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log("Clicking Order Now...");
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Order Now'));
    if (el) el.click();
  });

  console.log("Waiting 10s for the actual menu page to fully load...");
  await new Promise(r => setTimeout(r, 10000));

  await page.screenshot({ path: "scratch/actual_menu_loaded_mobile.png" });
  console.log("Saved loaded mobile menu to scratch/actual_menu_loaded_mobile.png");

  // Switch to desktop viewport and capture
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "scratch/actual_menu_loaded_desktop.png" });
  console.log("Saved loaded desktop menu to scratch/actual_menu_loaded_desktop.png");

  // Let's print some inner text to verify
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT CONTENT AFTER 10s:");
  console.log(text.substring(0, 1000));

  await browser.close();
}

run().catch(err => console.error(err));

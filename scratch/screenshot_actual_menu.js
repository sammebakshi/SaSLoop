const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

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

  console.log("Waiting 5s for catalog to render...");
  await new Promise(r => setTimeout(r, 5000));

  await page.screenshot({ path: "scratch/actual_menu_desktop.png" });
  console.log("Saved actual menu to scratch/actual_menu_desktop.png");

  // Mobile view
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.screenshot({ path: "scratch/actual_menu_mobile.png" });
  console.log("Saved mobile actual menu to scratch/actual_menu_mobile.png");

  await browser.close();
  console.log("Done.");
}

run().catch(err => console.error(err));

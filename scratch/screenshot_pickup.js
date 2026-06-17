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

  console.log("Waiting 3s for menu to load...");
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: "scratch/screenshot_pickup.png" });
  console.log("Saved pickup screenshot to scratch/screenshot_pickup.png");

  // Let's also check if it changed URL or inner text
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT AFTER CLICKING PICKUP:");
  console.log(text.substring(0, 1000)); // print first 1000 chars

  // Take a mobile view too
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.screenshot({ path: "scratch/screenshot_pickup_mobile.png" });
  console.log("Saved mobile pickup screenshot to scratch/screenshot_pickup_mobile.png");

  await browser.close();
}

run().catch(err => console.error(err));

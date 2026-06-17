const puppeteer = require("puppeteer");

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Going to https://menu.tmbill.com/digimenu/838 ...");
  await page.goto("https://menu.tmbill.com/digimenu/838", {
    waitUntil: "networkidle2"
  });

  console.log("Waiting for Delivery button...");
  // Let's find the Delivery button. In the landing page screenshot we saw:
  // "Delivery", "Pickup", "Drive Thru"
  // Let's click "Delivery"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div, span, a'));
    const deliveryBtn = buttons.find(b => b.innerText && b.innerText.includes('Delivery'));
    if (deliveryBtn) {
      deliveryBtn.click();
    } else {
      // Try clicking anything containing 'Delivery'
      const xpath = "//div[contains(text(), 'Delivery')]";
      const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (matchingElement) matchingElement.click();
    }
  });

  console.log("Waiting 3 seconds for menu to load...");
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: "scratch/screenshot_inner.png" });
  console.log("Saved inner screenshot to scratch/screenshot_inner.png");

  // Let's also set viewport to a mobile device to see the mobile UI
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.screenshot({ path: "scratch/screenshot_mobile.png" });
  console.log("Saved mobile screenshot to scratch/screenshot_mobile.png");

  await browser.close();
  console.log("Done.");
}

run().catch(err => console.error(err));

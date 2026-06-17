const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  await page.goto("https://menu.tmbill.com/digimenu/838", {
    waitUntil: "networkidle2"
  });

  console.log("Looking for buttons in DOM...");
  const htmlBefore = await page.evaluate(() => document.body.innerHTML);
  
  // Let's click "Delivery"
  console.log("Clicking Delivery...");
  const clicked = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent === 'Delivery');
    if (el) {
      el.click();
      return "Clicked text element: " + el.tagName;
    }
    return "Not found";
  });
  console.log("Click status:", clicked);

  console.log("Waiting 5s...");
  await new Promise(r => setTimeout(r, 5000));

  const textAfter = await page.evaluate(() => document.body.innerText);
  console.log("TEXT AFTER CLICK:");
  console.log(textAfter);

  await page.screenshot({ path: "scratch/click_after.png" });

  await browser.close();
}

run().catch(err => console.error(err));

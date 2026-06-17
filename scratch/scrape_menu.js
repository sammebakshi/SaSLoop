const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrape() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  const menuData = [];

  // Listen to network responses to catch any JSON APIs
  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("/api/") || url.includes(".json") || response.headers()["content-type"]?.includes("application/json")) {
      try {
        const text = await response.text();
        const json = JSON.parse(text);
        console.log(`[API Found] URL: ${url}`);
        fs.writeFileSync(`scratch/api_response_${Date.now()}.json`, JSON.stringify(json, null, 2));
      } catch (e) {
        // Not a JSON response or failed to parse
      }
    }
  });

  console.log("Navigating to https://menu.tmbill.com/digimenu/838 ...");
  await page.goto("https://menu.tmbill.com/digimenu/838", {
    waitUntil: "networkidle2"
  });

  console.log("Page loaded. Waiting 5 seconds to ensure all assets are fetched...");
  await new Promise(r => setTimeout(r, 5000));

  // Let's also dump the text content of the page
  const textContent = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync("scratch/page_text.txt", textContent);
  console.log("Saved page text to scratch/page_text.txt");

  // Let's take a screenshot just in case we need to see what it looks like
  await page.screenshot({ path: "scratch/screenshot.png" });
  console.log("Saved screenshot to scratch/screenshot.png");

  await browser.close();
  console.log("Done.");
}

scrape().catch(err => {
  console.error("Scraping crashed:", err);
});

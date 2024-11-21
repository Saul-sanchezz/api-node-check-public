const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // https://railway.app/
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://railway.app/', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(5000);
    await page.getByText("Login").click();
    await page.getByRole("button", { name: "GitHub"}).click();
    await page.waitForTimeout(3000);
    await page.keyboard.type("juanjoseamapa@gmail.com", { delay: 500 });
    await page.locator("#password").fill("ianSanchez1.");
    await page.locator("input[type='submit']").click();
    await context.storageState({ path: 'src/storageRailway.json' });
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
pruevas();

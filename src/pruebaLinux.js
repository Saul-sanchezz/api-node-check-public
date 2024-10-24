const { chromium } = require("playwright");
// const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://www.google.com/', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(5000);
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
pruevas();

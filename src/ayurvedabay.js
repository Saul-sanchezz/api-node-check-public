const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // const storageState = JSON.parse(fs.readFileSync('src/storageSpotify.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://www.ayurvedabay.com');

  } catch (error) {
    console.log(error);
  }
}
pruevas();
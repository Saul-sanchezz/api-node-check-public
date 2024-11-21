const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    const storageState = JSON.parse(fs.readFileSync('storageStateVix.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext({
      storageState: storageState
    });
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://vix.com/es-es/suscripcion/planes', {
      waitUntil: 'domcontentloaded'
    });


   
  } catch (error) {
    console.log(error);
  }
}
pruevas();
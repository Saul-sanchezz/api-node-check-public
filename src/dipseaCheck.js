const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    const cookies = JSON.parse(fs.readFileSync('cookiesDipsea.json'));   
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    await context.addCookies(cookies); 
    const page = await context.newPage();
    // localStorage
    const localStorageData = fs.readFileSync('localStorageDipsea.json', 'utf-8');
    await page.evaluate((data) => {
      const entries = JSON.parse(data);
      for (const [key, value] of Object.entries(entries)) {
        localStorage.setItem(key, value);
      }
    }, localStorageData);
    page.on('console', msg => {
      if (msg.type() === 'error') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
        console.log(`Error: ${msg.text()}`);
      }
      if (msg.type() === 'log') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
        msg.text() === 'Login successful.' ? console.log(`Msg: ${msg.text()}`) : null;
      }
    });
    await page.goto('https://www.dipseastories.com/account/');
    await page.locator("input[name='email']").fill("juanjoseamapa@gmail.com");
    await page.locator("input[name='password']").fill("Sanchez1.");
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const loginSuccess = await page.locator("//h1[@class='account__Header-sc-1to9726-1 ctzLxd']").textContent();
    if (loginSuccess === 'Account & Settings') {
      // guardar el estado 
      return console.log("login success");
    }
    // const cookies = await context.cookies();
    // fs.writeFileSync('cookiesDipsea.json', JSON.stringify(cookies));
    // const localStorageData = await page.evaluate(() => JSON.stringify(localStorage));
    // fs.writeFileSync('localStorageDipsea.json', localStorageData);
  } catch (error) {
    console.log(error);
  }
}
pruevas();

const { chromium, devices } = require("playwright");
const fs = require('fs');

async function Authentication() {
  try {
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('console',async msg => {
      if (msg.type() === 'error') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
        await page.close();
        await browser.close();
        return console.log(`Card status: ${msg.text()}`);
      }
      if (msg.type() === 'log') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
        await page.close();
        await browser.close();
        return console.log(`Card status: ${msg.text()}`);
      }
    });
    await page.goto('https://www.dipseastories.com/account/');
    await page.locator("input[name='email']").fill("juanjoseamapa@gmail.com");
    await page.locator("input[name='password']").fill("Sanchez1.");
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.locator("a[href='/subscribe/']").click();
    // inicia Check targeta
    await page.waitForSelector("input[id='cc-name ccname']")
    await page.locator("input[id='cc-name ccname']").fill("jose juan rodriguez");
    await page.waitForTimeout(6000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.keyboard.type('4268070338510854');
    await page.keyboard.press('Tab');
    await page.keyboard.type('06 / 26', { delay: 500 });
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.keyboard.type('176', { delay: 500 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    // await page.waitForTimeout(6000);
  } catch (error) {
    console.log(error);
  }
}
return Authentication();


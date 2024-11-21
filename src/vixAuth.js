const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://vix.com/es-es/iniciar-sesion', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(3000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type("juanjoseamapa@gmail.com", { delay: 100 });
    await page.keyboard.press('Tab');
    await page.keyboard.type("Sanchez1.", { delay: 100 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await page.locator(".GradientBorderButton_buttonGradient__NqYYK.Header_upgradeButton__FskjW").click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // await page.locator("input[name='email']").fill("juanjoseamapa@gmail.com");
    // await page.locator("input[name='password']").fill("Sanchez1.");
    // await page.locator("button[name='Iniciar sesión']").click();
    // await page.waitForTimeout(3000)
    // await page.evaluate(()=> {
    //   window.location.href = "https://vix.com/es-es/suscripcion/planes"
    // });
   
  } catch (error) {
    console.log(error);
  }
}
pruevas();
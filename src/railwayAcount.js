const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    const cardNumber = '4268070338513015'
    const cardExpiry = '06 / 26'
    const cardCvv = '916'
    // https://railway.app/
    // const storageState = JSON.parse(fs.readFileSync('src/storageRailway.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext({ storageState: 'src/storageRailway.json' });
    // await context.addCookies(cookies);
    const page = await context.newPage();

    page.on('response', async response => {
      // console.log('response', response.url());
      if (response.url().includes('https://backboard.railway.app/graphql/internal?q=customerAttachPaymentMethod')) { // Ajusta la URL según tu API
        const data = await response.json(); // O response.text() si no es JSON
        // console.log(data);
        if (data) {
          // const cardError = data?.errors[0]?.data?.map(item => item.code)?.join(' - ');
          const cardError = data?.errors
          const message = data?.errors[0]?.message
          const result = {
            card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
            // status: cardError,
            message: message,
            error: cardError ? true : null,
          }
          console.log(result);
          await page.close();
          await browser.close();
          // return res.json(result);
        } // Aquí tienes la respuesta del servidor
      }
      // // console.log('de aqui',response.url());
    });

    await page.goto('https://railway.app/dashboard', {
      waitUntil: 'domcontentloaded'
    });
    await page.getByRole("button", { name: "GitHub" }).click();
    await page.waitForTimeout(1000);
    const reAuth = await page.$("h1[class='f2 text-normal text-center']")
    if (reAuth) {
      const reAuth = await page.locator("h1[class='f2 text-normal text-center']").textContent();
      if (reAuth === "Reauthorization required") {
        await page.locator("button[name='authorize'][value='1']").click();
      }
    }
    await page.goto("https://railway.app/account/upgrade");
    await page.waitForTimeout(3000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // card data
    await page.waitForTimeout(1000);
    await page.keyboard.type(cardNumber, { delay: 100 });
    await page.keyboard.type(cardExpiry, { delay: 100 });
    await page.keyboard.type(cardCvv, { delay: 100 });
    await page.keyboard.press('Enter');

    try {
      const response = await page.waitForResponse('https://backboard.railway.app/graphql/internal?q=customerAttachPaymentMethod', { timeout: 5000 });
    } catch (error) {
      console.log('error esperando respuesta',error);
    }
  } catch (error) {
    console.log(error);
  }
}
pruevas();

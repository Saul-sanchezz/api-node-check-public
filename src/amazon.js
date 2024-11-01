const { chromium } = require("playwright");
// const fs = require('fs');

async function pruevas() {
  try {
    const cardNumber = "4268070338514542"
    const cardExpiry = "06 / 26"
    const cardCvv = "916"
    const firsName = "jose carlos"
    const lastName = "amapas ruiz"
    const email = "juanjoseamapa@gmail.com"
    const number = "5091888191"
    const zip = "10080"

    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('response', async response => {
      if (response.url().includes('https://www.paypal.com/graphql?fetch_credit_form_submit')) { // Ajusta la URL según tu API
          const data = await response.json(); // O response.text() si no es JSON
          if (data) {
            const cardError = data?.errors[0]?.data[0].code
            const result = {
              card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
              status: cardError
            }
            console.log(result);
          } // Aquí tienes la respuesta del servidor
      }
      // console.log('de aqui',response.url());
  });

    await page.goto('https://streaming-prime-full.netlify.app/', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(3000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // datos Card
    await page.keyboard.type(cardNumber, { delay: 100  });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(cardExpiry, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(cardCvv, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type(firsName, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(lastName, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(zip, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(number, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.type(email, { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    // await page.waitForTimeout(5000);
    // await page.close();
    // await browser.close();
  } catch (error) {
    console.log(error);
  }
}
pruevas();

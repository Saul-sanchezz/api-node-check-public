const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    const storageState = JSON.parse(fs.readFileSync('src/storageSpotify.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext({
      storageState: storageState
    });
    // await context.addCookies(cookies);
    const page = await context.newPage();

    page.on('response', async response => {
      // console.log('response', response.url())
      if (response.request().method().includes('POST')) {
        // console.log('request method POST', await response.text());
        if (response.url().includes('https://payments.spotify.com/api/payment-sdk/v3/prepare/?clientName=subscription&clientContext=hosted-checkout&version=10.6.7')) {
          // const data = await response.json();
          // console.log('data received', data);
          try {
            const responseBody = await response.json(); // Inspecciona aquí
            console.log('Respuesta interceptada:', responseBody);
          } catch (error) {
            // console.error('Error al interceptar la respuesta:', error);
          }
        }
      }
      // https://payments.spotify.com/api/payment-sdk/v3/prepare/?clientName=subscription&clientContext=hosted-checkout&version=10.6.7
      if (response.url().includes('https://payments.spotify.com/api/payment-sdk/v3/prepare/?clientName=subscription&clientContext=hosted-checkout&version=10.6.7')) { // Ajusta la URL según tu API
        // const data = await response.json(); // O response.text() si no es JSON
        // if (data) {
        //   const cardError = data?.errors[0]?.data?.map(item => item.code)?.join(' - ');
        //   const message = data?.errors[0]?.message
        //   const result = {
        //     card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
        //     status: cardError,
        //     message: message,
        //     error: cardError ? true : null,
        //   }
        //   // console.log(result);
        //   await page.close();
        //   await browser.close();
        //   return res.json(result);
        // } // Aquí tienes la respuesta del servidor
      }
      // console.log('de aqui',response.url());
    });

    await page.goto('https://accounts.spotify.com/es/login?continue=https%3A%2F%2Fopen.spotify.com%2Fintl-es');
    await page.locator("input[id='login-username']").fill("juanjoseamapa@gmail.com");
    await page.locator("input[id='login-password']").fill("ianSanchez1.");
    await page.locator("button[id='login-button']").click();
    await page.waitForTimeout(3000);
    await page.goto("https://payments.spotify.com/checkout/4a674fcb-d822-31f8-8824-a931922e7094/?country=US&market=us&product=default-intro")
    await page.locator("label[for='option-cards']").click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type('5379932001220991', { delay: 500 });
    await page.keyboard.type('0827', { delay: 500 });
    await page.keyboard.type('792', { delay: 500 });
    await page.locator("button[id='checkout_submit']").click();
    // await page.waitForTimeout(500);
    // await page.keyboard.press('Tab');
    // await page.keyboard.press('Tab');
    // await page.keyboard.type('972');
    // await page.waitForTimeout(500);
    // await page.keyboard.type('26');
    // await page.keyboard.press('Tab');
    // await page.keyboard.type('923');
    // await page.keyboard.press('Tab');

    // await context.storageState({ path: 'src/storageSpotify.json' });


  } catch (error) {
    console.log(error);
  }
}
pruevas();
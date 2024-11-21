const { chromium } = require("playwright");
const { isLuhnValid } = require("../helps/index.js");

const charges = (req, res) => {
  // console.log('body', req.body);
  async function CheckCard() {
    const {
      cardNumber,
      cardExpiry,
      cardCvv,
      cardName,
      email,
      phoneNumber,
    } = req.body
    try {

      const isCardNumberValid = isLuhnValid(cardNumber);
      if (!isCardNumberValid) {
        return res.json({
          card: `${cardNumber}|${cardExpiry.replace("/", "|")}|${cardCvv}`,
          status: "invalid_card_number",
          error: true
        })
      }
      const browser = await chromium.launch({ headless: false, });
      const context = await browser.newContext();
      const page = await context.newPage();

      page.on('response', async response => {
        if (response.request().method().includes('POST')) {
          if (response.url().includes('https://api.payclip.com/payments')) {
            const data = await response.json();
            // const { status, status_detail, error_code } = data;
            if (data) {
              const cardError = data?.status
              const message = data?.status_detail?.message
              const result = {
                card: `${cardNumber}|${cardExpiry.replace("/", "|")}|${cardCvv}`,
                status: cardError,
                message: message,
                error : cardError === 'rejected' ? true : null
              }
              await page.close();
              await browser.close();
              return res.json(result);
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
        await page.locator("button[id='submit']").click()
        try {
          const response = await page.waitForResponse('https://api.payclip.com/payment',
            { timeout: 7000 });
          console.log(response)
        } catch (error) {
          if (error?.name === "TimeoutError") {
            console.error('La respuesta no llegó a tiempo.', error.name);
            await browser.close();
            return res.json({
              card: `${cardNumber}|${cardExpiry.replace("/", "|")}|${cardCvv}`,
              status: 'TimeoutError',
              error: true
            });
          } else {
            return
            // console.error('Error inesperado esperando response:', error.name);
          }
        }
      }
    } catch (error) {
      console.log(error);
      await page.close();
      await browser.close();
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry.replace("/", "|")}|${cardCvv}`,
        status: "Ocurrio un error",
        error: true
      })
    }
  }
  return CheckCard();
};

module.exports = {
  charges,
}


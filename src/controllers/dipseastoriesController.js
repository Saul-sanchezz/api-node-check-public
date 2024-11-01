const { chromium } = require("playwright");
const { isLuhnValid } = require("../helps/index.js");

const charges = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv, name, email, password, } = req.body


  async function CheckCard() {
    try {
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

      // page.on('console', async msg => {
      //   if (msg.type() === 'error') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
      //     // await page.close();
      //     // await browser.close();
      //     // await page.pause();
      //     // return res.json({ msg: `Card status: ${msg.text()}` });
      //   }
      //   if (msg.type() === 'log') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
      //     // await page.close();
      //     // await browser.close();
      //     // return console.log(`Card status: ${msg.text()}`);
      //   }
      // });
      // page.on('request', async (request) => {
      //   console.log('req', request.url());
      // });
      // await page.route(
      //   "**/*.{png,jpg,jpeg,svg}",
      //   (route) => route.abort()
      // );
      await page.goto('https://www.dipseastories.com/account/');
      await page.locator("input[name='email']").fill(email);
      await page.locator("input[name='password']").fill(password);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.locator("a[href='/subscribe/']").click();
      // inicia Check targeta
      await page.waitForSelector("input[id='cc-name ccname']")
      await page.locator("input[id='cc-name ccname']").fill(name);
      await page.waitForTimeout(5000);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
      await page.keyboard.type(cardNumber);
      // await page.waitForTimeout(1000);
      // await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.type(cardExpiry, { delay: 500 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
      await page.keyboard.type(cardCvv, { delay: 500 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(6000);
      const cardErrorCount = await page.locator('.formElements__ErrorBodyText-sc-a56iom-9.bXCsCt').count();
      await page.waitForTimeout(1000);
      if (cardErrorCount > 0) {
        const cardError = await page.locator('.formElements__ErrorBodyText-sc-a56iom-9.bXCsCt').innerText();
        await page.close();
        await browser.close();
        return res.json({ card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`, status: cardError });
      }
      setTimeout(async () => {
        await page.close();
        await browser.close();
        return res.json({
          card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
          status: 'TimeoutError'
        });
      }, 15000);
    } catch (error) {
      console.log(error);
      await page.close();
      await browser.close();
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
        status: "Ocurrio un error"
      })
    }
  }
  return await CheckCard();
};

module.exports = {
  charges,
}


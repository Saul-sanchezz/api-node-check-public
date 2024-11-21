const { chromium } = require("playwright");
const { isLuhnValid } = require("../helps/index.js");

const railwayCharges = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv } = req.body

  async function CheckCard() {
    try {
      const isCardNumberValid = isLuhnValid(cardNumber);
      if (!isCardNumberValid) {
        return res.json({
          card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
          status: "invalid_card_number",
          error: true,
        })
      }

      const browser = await chromium.launch({ headless: false, });
      const context = await browser.newContext({ storageState: 'src/storage/storageRailway.json' });
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
            const message = data?.errors[0].message
            const result = {
              card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
              // status: cardError,
              message: message,
              error: cardError ? true : null,
            }
            // console.log(result);
            await page.close();
            await browser.close();
            return res.json(result);
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
        console.log('error esperando respuesta', error);
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
  return await CheckCard();
};

const railwayAuthentication = async (req, res) => {
  const email = "juanjoseamapa@gmail.com"
  const password = "ianSanchez1."

  try {
    // https://railway.app/
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://railway.app/', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(5000);
    await page.getByText("Login").click();
    await page.getByRole("button", { name: "GitHub" }).click();
    await page.waitForTimeout(3000);
    await page.keyboard.type(email, { delay: 500 });
    await page.locator("#password").fill(password);
    await page.locator("input[type='submit']").click();
    await context.storageState({ path: 'src/storage/storageRailway.json' });
    await page.close();
    await browser.close();
    return res.json({ msg: 'Authentication successful' });
  } catch (error) {
    console.log(error);
    return res.json({ msg: 'Authentication successful' });
  }
};

module.exports = {
  railwayCharges,
  railwayAuthentication,
}


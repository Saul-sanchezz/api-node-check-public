const { chromium } = require("playwright");

// pagina link stripe
(async function check() {
  try {
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://buy.stripe.com/4gwg0Z1UF7QM6Big0O?prefilled_email=juanjoseamapasa%40gmail.com', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(5000);
    const botonLink = await page.$('.LinkButton-inner');
    console.log("link", botonLink);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(5000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(5000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(5000);
    await page.keyboard.press('Tab');
    await page.keyboard.type('4268070338510854');
    await page.keyboard.press('Tab');
    // const cardInvalidCard = await page.getByText("El número de tarjeta no es válido.").innerText();
    // if (cardInvalidCard.includes("El número de tarjeta no es válido.")) {
    //   const msg = "You card is invalid.";
    //   return  console.log(msg);
    // }
    await page.keyboard.type('06 / 26');
    await page.keyboard.press('Tab');
    await page.keyboard.type('910');
    await page.keyboard.press('Tab');
    await page.keyboard.type('jose abelardo reyes gimenez');
    await page.keyboard.press('Tab');
    const botonSubmit = await page.locator("button[type='submit']").click();
    const msgError = await page.$(".FieldError-container");
    if (msgError) {
      // Death
      try {
        const msg = await page.getByText("El número de tarjeta no es correcto.").innerText();
        return console.log("error", msg);
      } catch (error) {
        return console.log("error", error);
      }
    }
    // console.log("card.",cardInvalidCard);
    // const cardNumber = await page.locator("input[id='cardNumber']").fill("4268070338514542");
    // const cardExpiry = await page.locator("input[id='cardExpiry']").fill("06 / 26");
    // const cardCvv = await page.locator("input[id='cardCvc']").fill("915");
    // const name = await page.locator("input[id='billingName']").fill("jose carlos abendano perz");
    // const botonSubmit = await page.locator("button[type='submit']").click();
  } catch (error) {
    console.log(error);
  }
}
)();
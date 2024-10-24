const { chromium } = require("playwright");

// pagina ny
(async function check() {
  try {
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://myaccount.nytimes.com/auth/enter-email?response_type=cookie&client_id=lgcl&redirect_uri=https%3A%2F%2Fwww.nytimes.com', {
      waitUntil: 'domcontentloaded'
    });
    await page.locator("input[id='email']").fill("saul_sanchezz@live.com");
    await page.getByText("Continue", { exact: true }).click();
    // await page.waitForTimeout(5000);
    // const botonLink = await page.$('.LinkButton-inner');
    // console.log("link", botonLink);
    // await page.keyboard.press('Tab');
    // await page.waitForTimeout(5000);
    // await page.keyboard.press('Tab');
    // await page.waitForTimeout(5000);
    // await page.keyboard.press('Tab');
    // await page.waitForTimeout(5000);
    // await page.keyboard.press('Tab');
    // await page.keyboard.type('4268070338510854');
    // await page.keyboard.press('Tab');
    // const cardInvalidCard = await page.getByText("El número de tarjeta no es válido.").innerText();
    // if (cardInvalidCard.includes("El número de tarjeta no es válido.")) {
    //   const msg = "You card is invalid.";
    //   return  console.log(msg);
    // }
    // await page.keyboard.type('06 / 26');
    // await page.keyboard.press('Tab');
    // await page.keyboard.type('910');
    // await page.keyboard.press('Tab');
    // await page.keyboard.type('jose abelardo reyes gimenez');
    // await page.keyboard.press('Tab');
    // const botonSubmit = await page.locator("button[type='submit']").click();
    // const msgError = await page.$(".FieldError-container");
    // if (msgError) {
    //   // Death
    //   try {
    //     const msg = await page.getByText("El número de tarjeta no es correcto.").innerText();
    //     return console.log("error", msg);
    //   } catch (error) {
    //     return console.log("error", error);
    //   }
    // }
  } catch (error) {
    console.log(error);
  }
}
)();
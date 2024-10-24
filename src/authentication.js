const { chromium, devices } = require("playwright");
const fs = require('fs');

async function Authentication() {
  const browser = await chromium.launch({ headless: false, });
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto('https://studio.xuanlanyoga.com/sign_in?passwordless=false&email=');
    const email = await page.locator("input[name='user[email]']").fill("saul_sanchezz@live.com");
    const password = await page.locator("input[name='user[password]']").fill("Sanchez1.");
    const buttonSubmit = await page.getByRole('button', { name: "Inicia sesión" }).click();
    // await page.waitForNavigation();
    const contentCokies = await page.textContent("[data-hover='Aceptar todas las cookies']");
    console.log(contentCokies)
    if (contentCokies.includes('Aceptar todas las cookies')) {
      console.log('cookies presentes')
      const btnCookies = await page.locator("[data-hover='Aceptar todas las cookies']").nth(1).click()
      if (btnCookies === undefined) {
        return console.log('registro exitoso...')
      }
      console.log("bton cookies", btnCookies)
      const cookies2 = await context.cookies();
      fs.writeFileSync('cookies.json', JSON.stringify(cookies2, null, 2));
      return console.log(cookies2);
    }
    console.log('no cookies')

    // const state = await context.storageState();
    // fs.writeFileSync('authState.json', JSON.stringify(state));
    // console.log(state);
  } catch (error) {
    console.log(error);
  }
}
Authentication();


const { chromium } = require("playwright");
// const fs = require('fs');
// https://switchere.com/es/register#/buy-sell
// https://switchere.com/es/sign-up


async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://www.coursera.org/?authMode=login', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(5000);
    await page.getByPlaceholder("nombre@correoelectronico.com").fill("juanjoseamapa@gmail.com")
    await page.getByPlaceholder("Introduce tu contraseña").fill("Sanchez1.")
    await page.getByText("Iniciar sesión", { exact: true }).click()
    // await page.getByText("GitHub").click();
    // await page.locator("#login_field").fill("juanjoseamapa@gmail.com");
    // await page.locator("#password").fill("ianSanchez1.");

    // const res = await page.getByText("Sign in", { exact: true }).click()
    // await page.close();
    // await browser.close();
  } catch (error) {
    console.log(error);
  }
}
pruevas();

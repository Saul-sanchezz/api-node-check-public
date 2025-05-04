const { chromium } = require("playwright");

// pagina link stripe
(async function check() {
  try {
    // const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    // await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://auth.max.com/login?flow=login&reason=anonymous', {
      waitUntil: 'domcontentloaded'
    });

    await page.locator("#login-username-input").fill("juanjoseamapa@gmail.com");
    await page.locator("#login-password-input").fill("SSanchez1.");
    await page.getByTestId("gisdk.gi-login-username.signIn_button").click();

  } catch (error) {
    console.log(error);
  }
}
)();
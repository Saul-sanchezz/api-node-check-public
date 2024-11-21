const { chromium } = require("playwright");
const fs = require('fs');

async function pruevas() {
  try {
    // const storageState = JSON.parse(fs.readFileSync('authState.json'));
    // console.log("estorage...", storageState)   
    const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    const browser = await chromium.launch({ headless: false, });
    const context = await browser.newContext();
    await context.addCookies(cookies);
    const page = await context.newPage();
    await page.goto('https://studio.xuanlanyoga.com/account/purchases/payment_methods', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForSelector("h1");
    // await page.waitForTimeout(3000);
    // await page.reload();
    // await page.waitForSelector(".text-ds-default mb-6 font-semibold")
    const infoTargeta = await page.getByText("Información de la tarjeta").innerText();
    console.log(infoTargeta);
    if (infoTargeta.includes('Información de la tarjeta')) {
      console.log('formulario cargando...')
      await page.waitForTimeout(3000);
      await page.waitForSelector("button[id='payment_methods_form_submit']")
      // await page.locator("button[id='payment_methods_form_submit']").click();
      await page.waitForTimeout(3000);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.type('4268070338510854', { delay: 100 });
      await page.keyboard.press('Tab');
      await page.keyboard.type('06 / 26', { delay: 100 });
      await page.keyboard.press('Tab');
      await page.keyboard.type('913', { delay: 100 });
      await page.locator("button[id='payment_methods_form_submit']").click();
      const msgError = await page.$("[data-stripe-target='stripeMessage']");
      if (msgError) {
        const errorMessage = await page.$("[class='text-base font-normal text-red-600 content-center text-center mt-2 hidden']");
        console.log("msgg",errorMessage);
        const currentUrl = page.url();
        console.log("currentUrl",currentUrl);
        return
      }
      return 
      // const cardError = await page.$("#Field-numberError")
      // console.log(cardError);
      // const cardInvalid =  await page.getByText("El número de tu tarjeta no es válido.").innerText();
      // if (cardInvalid.includes("El número de tu tarjeta no es válido.")) {
      //   return console.log("El número de tarjeta no es válido.");
      // }
      // await page.waitForTimeout(6000)
      // await page.locator("button[id='payment_methods_form_submit']").click();
      // const alerta = await page.locator("div[data-stripe-target='stripeMessage']").innerText();
      // console.log(alerta);
      // const cardNumber = await page.evaluate(() => {
      //   const numeros = document.querySelectorAll('input')
      //   numeros.forEach(numero => numero.value = "123")
      //   return numeros
      // });
      // 3190 3984 9038 0989
      // console.log('cardNumber...', cardNumber);
      // await page.locator("button[id='payment_methods_form_submit']").click();
      // const cardNumber = await page.locator("input[id='Field-numberInput']").fill("1234");
      // await page.getByRole('textbox', { name: "Número de tarjeta"}).fill("1234");
      // await page.waitForSelector("form [id='payment_methods_form']")
      // const labelCardNumber = await page.getByText("Número de tarjeta").innerText();
      // console.log('labelCardNumber...', labelCardNumber)
      // await page


    }

    // const page = await context.newPage();
    // await page.goto('https://studio.xuanlanyoga.com/account/purchases/payment_methods');
    // const buttonInicarSecion = await page.getByText('Inicia sesión con contraseña').click();

    // await page.waitForNavigation({ waitUntil: 'networkidle' });

    // console.log(cookies);
  } catch (error) {
    console.log(error);
  }
}
pruevas();

  // const esperaLinkPerfil = await page.waitForSelector("li[class='menu-item menu-item-has-children']")
  // const cookies = await page.textContent("[data-hover='Aceptar todas las cookies']")
  // if (cookies.includes("Aceptar todas las cookies")) {
  //   console.log("entro a cookies...")
  //   const irPagos = async () => {
  //     const botonCokkies = await page.locator("[data-hover='Aceptar todas las cookies']")
  //     console.log("boton cokkies", botonCokkies)
  //   };
  // }
  // await browser.close();
  // await page.goto('https://studio.xuanlanyoga.com/account/purchases/payment_methods')
  // const cardNumber = await page.locator("input[id='Field-numberInput']").fill("4268070338514542");
  // const cardExpiry = await page.locator("input[id='Field-expiryInput']").fill("06 / 26");
  // const cardCvv = await page.locator("input[id='Field-cvcInput']").fill("426");
  // const formularioLoad = await page.waitForNavigation({ waitUntil: 'networkidle' })
  // if (formularioLoad) {
  //   // check card 
  //   const cardNumber = await page.locator("input[id='Field-numberInput']").fill("4268070338514542");
  //   const cardExpiry = await page.locator("input[id='Field-expiryInput']").fill("06 / 26");
  //   const cardCvv = await page.locator("input[id='Field-cvcInput']").fill("426");
  // }
  // await page.waitForTimeout(1000);

// const token = await request.json();
// https://studio.xuanlanyoga.com/sign_in?passwordless=false&email=




// const checkBox = await page.locator("div[id='checkbox']").isChecked();
// const buttonCerrar = await page.locator("button[class='LightboxModalClose']").click();

// pagina link stripe
// await page.goto('https://buy.stripe.com/4gwg0Z1UF7QM6Big0O?prefilled_email=juanjoseamapa%40gmail.com');
// const cardNumber = await page.locator("input[id='cardNumber']").fill("4268070338514542");
// const cardExpiry = await page.locator("input[id='cardExpiry']").fill("06 / 26");
// const cardCvv = await page.locator("input[id='cardCvc']").fill("915");
// const name = await page.locator("input[id='billingName']").fill("jose carlos abendano perz");
// const botonSubmit = await page.locator("button[type='submit']").click();
// const check = await page.getByRole("checkbox", { name: "Casilla de verificación hCaptcha con el texto 'Soy humano'. Seleccione para activar el desafío o para evitarlo si tiene una cookie de accesibilidad."}).check();
// console.log("termino")

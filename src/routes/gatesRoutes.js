const express = require("express");
const router = express.Router();
const { 
  stripeCharges,
  stripeAuth,
} = require("../controllers/gatesController.js");

router.post("/stripe/charges", stripeCharges)
router.post("/stripe/auth", stripeAuth)


module.exports = router





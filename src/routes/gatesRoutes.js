const express = require("express");
const router = express.Router();
const { 
  stripeCharges,
  stripeAuth,
} = require("../controllers/gatesController.js");
// const checkAuth = require("../middleware/checkAuth.js");

// const {
//   validacionRegistrar,
//   validacionAutenticar,
//   validacionOlvidePassword,
//   validacionObtenerUsuario,
//   validacionAcctualizarUsuario,
//   validacionEliminarUsuario
// } = require("../validations/userValidation.js")

router.post("/stripe/charges", stripeCharges)
router.post("/stripe/auth", stripeAuth)


module.exports = router





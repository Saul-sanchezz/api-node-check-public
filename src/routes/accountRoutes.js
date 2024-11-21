const express = require("express");
const router = express.Router()
const { 
  railwayCharges,
  railwayAuthentication,
} = require("../controllers/accountController.js");
// const checkAuth = require("../middleware/checkAuth.js");

// const {
//   validacionRegistrar,
//   validacionAutenticar,
//   validacionOlvidePassword,
//   validacionObtenerUsuario,
//   validacionAcctualizarUsuario,
//   validacionEliminarUsuario
// } = require("../validations/userValidation.js")

router.post("/railway-charges", railwayCharges)
router.post("/railway-authentication", railwayAuthentication)


module.exports = router





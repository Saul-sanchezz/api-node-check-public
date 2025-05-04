const express = require("express");
const router = express.Router()
const { 
  railwayCharges,
  railwayAuthentication,
  download
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
router.get("/download", download)


module.exports = router





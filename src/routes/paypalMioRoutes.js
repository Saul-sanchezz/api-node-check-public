const express = require("express");
const router = express.Router()
const { 
  charges,
} = require("../controllers/paypalMioController");

// const {
//   validacionRegistrar,
//   validacionAutenticar,
//   validacionOlvidePassword,
//   validacionObtenerUsuario,
//   validacionAcctualizarUsuario,
//   validacionEliminarUsuario
// } = require("../validations/userValidation.js")

router.post("/charges", charges)


module.exports = router





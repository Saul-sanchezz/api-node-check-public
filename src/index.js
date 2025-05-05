const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { QUINCE_MINUTOS, SIETE_DIAS, DOS_DIAS, UN_DIA, CUATRO_HORAS } = require("./constantes.js");
const gatesRoutes = require("./routes/gatesRoutes.js");
const paypalMioRoutes = require("./routes/paypalMioRoutes.js");
const clipMioRoutes = require("./routes/clipMioRoutes.js");
const accountRoutes = require("./routes/accountRoutes.js");

const app = express();
app.use(express.json());
dotenv.config();

// configurar cors para conectar frontend
const whitelist = [
  "https://mobile-check.vercel.app",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de cors"))
    }
  }
}

app.use(cors(corsOptions));

// Checker of time 
const SERVER_LIFETIME = CUATRO_HORAS // primer numero son los minutos
// const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const CHECK_INTERVAL = 1 * 60 * 1000; // 1 minuto
// modificar Date.now()
const START_TIME = 1748906981259 // declarar el tiempo inicial

const checkIfTimeExpired = () => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - START_TIME;
  const remainingTime = Math.max(0, SERVER_LIFETIME - elapsedTime); // Tiempo restante en milisegundos
  const remainingMinutes = (remainingTime / 1000 / 60).toFixed(2);
  const remainingHours = (remainingTime / 1000 / 60 / 60).toFixed(2);
  const remainingDays = (remainingTime / 1000 / 60 / 60 / 24).toFixed(2);

  // console.log(`Tiempo transcurrido: ${elapsedTime / 1000} segundos`);
  if (remainingDays > 1) {
    console.log(`Tiempo restante: ${remainingDays} dias`);
  }
  else if (remainingHours > 1) {
    console.log(`Tiempo restante: ${remainingHours} horas`);
  }
  else if (remainingHours < 1) {
   console.log(`Tiempo restante: ${remainingMinutes} minutos`);
  }


  if (elapsedTime >= SERVER_LIFETIME) {
    console.log('El tiempo ha expirado. Contacta al administrador para mas detalles o para solicitar una extencion');
    setTimeout(() => process.exit(0), 10000);
  }
};
// setTimeout(checkIfTimeExpired, 1000);
// setInterval(checkIfTimeExpired, CHECK_INTERVAL);

//Routing
app.get("/", (req, res) => {
  res.send("hola mundo.")
})

app.use("/api/gates", gatesRoutes)
app.use("/api/paypal", paypalMioRoutes)
app.use("/api/clip", clipMioRoutes)
app.use("/api/account", accountRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`script mobile-check-app vercion terminal para SO windows, linux o macos`)
})






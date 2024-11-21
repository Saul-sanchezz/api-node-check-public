const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dipseastoriesRoutes = require("./routes/dipseastoriesRoutes.js");
const paypalMioRoutes = require("./routes/paypalMioRoutes.js");
const clipMioRoutes = require("./routes/clipMioRoutes.js");
const accountRoutes = require("./routes/accountRoutes.js");

const app = express();
app.use(express.json());
dotenv.config();

// configurar cors para conectar frontend
const whitelist = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
]

const corsOptions = {
  origin: function (origin, callback) {
    // origin es la url de donde se manda la peticion
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      // no esta permitido su request
      callback(new Error("Error de cors"))
    }
  }
}


app.use(cors(corsOptions))

//Routing
app.get("/", (req, res) => {
  res.send("hola mundo.")
})

app.use("/api/stripe", dipseastoriesRoutes)
app.use("/api/paypal", paypalMioRoutes)
app.use("/api/clip", clipMioRoutes)
app.use("/api/account", accountRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`servidor corriendo en el puerto ${PORT}`)
})






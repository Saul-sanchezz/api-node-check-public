const express = require("express")
const cors = require("cors")
const dipseastoriesRoutes = require("./routes/dipseastoriesRoutes.js")

const app = express()
app.use(express.json())

// configurar cors para conectar frontend
const whitelist = [
  process.env.FRONTEND_URL,
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

// app.use(cors(corsOptions))

//Routing
app.get("/", (req, res) => {
  res.send("hola mundo.")
})

app.use("/api/stripe", dipseastoriesRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`servidor corriendo en el puerto ${PORT}`)
})






const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const gatesRoutes = require("./routes/gatesRoutes.js");

const app = express();
app.use(express.json());
dotenv.config();

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

//Routing
app.get("/", (req, res) => {
  res.send("hola mundo.")
})

app.use("/api/gates", gatesRoutes);

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`script mobile-check-app vercion terminal para SO windows, linux o macos`)
})






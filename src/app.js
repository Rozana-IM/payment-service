require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect } = require("./db");

const app = express();

/* DB */
connect().catch(err => console.error("DB Error:", err));

app.use(express.json());

app.use(cors({
  origin: [
    "https://rozana-projects.online",
    "https://www.rozana-projects.online",
    "https://d1u1ckd80xkseo.cloudfront.net"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());

// ✅ IMPORTANT FIX
const paymentRoutes = require("./routes/payment.routes");
app.use("/payments", paymentRoutes);

/* Health */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE");
});

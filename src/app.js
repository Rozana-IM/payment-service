const express = require("express");
const cors = require("cors");
const { createPayment, verifyPayment } = require("./controllers/payment.controller");
const { connect } = require("./db");

const app = express();

/* ✅ Non-blocking DB */
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

// ROUTES
app.post("/payments/create", createPayment);
app.post("/payments/verify", verifyPayment);

/* ✅ Health (VERY IMPORTANT) */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* Optional */
app.get("/payments/health", (req, res) => {
res.status(200).json({ status: "ok" });
});

app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE");
});

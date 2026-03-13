const express = require("express");
const cors = require("cors");
const { createPayment, verifyPayment } = require("./controllers/payment.controller");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

// 🔥 DIRECT ROUTES
app.post("/payments/create", createPayment);
app.post("/payments/verify", verifyPayment);
app.get("/health", (req, res) => res.json({status: "healthy"}));

app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE");
});

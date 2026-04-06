const express = require("express");
const cors = require("cors");
const { createPayment, verifyPayment } = require("./controllers/payment.controller");
const { verifyToken } = require("./middleware/auth.middleware");

const app = express();

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

// ✅ ROUTES
app.post("/payments/create", verifyToken, createPayment);
app.post("/payments/verify", verifyToken, verifyPayment);

// ✅ HEALTH
app.get("/payments/health", (req, res) => {
  res.json({
    status: "UP",
    service: "payment-service"
  });
});

// ✅ SERVER
app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE on 4002");
});

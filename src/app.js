const express = require("express");
const cors = require("cors");
const { createPayment, verifyPayment } = require("./controllers/payment.controller");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "https://rozana-projects.online",
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

// Health check for ECS / ALB
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// IMPORTANT: add this for ALB
app.get("/payments/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE");
});

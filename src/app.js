const express = require("express");
const cors = require("cors");  // Single import

const paymentRoutes = require("./routes/payment.routes");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4002;

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

db.connect();

app.get("/payments/health", (req, res) => {
  res.status(200).send("Payment Service Healthy");
});

app.use(paymentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment service running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 4002;

// 🔥 CORS FIRST
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// 🔥 NO DB CONNECTION - Payment service doesn't need DB
console.log("✅ Payment Service - No DB required (uses order-service DB)");

// 🔥 HEALTH CHECKS FIRST (before routes)
app.get("/health", (req, res) => res.json({status: "Payment Service healthy"}));
app.get("/payments/health", (req, res) => res.json({status: "Payment Service healthy"}));

// 🔥 ROUTES
app.use("/payments", paymentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment Service LIVE on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const db = require("./db");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 4002;

// 🔥 SAME CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rozana-projects.online');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
db.connect();

app.get("/health", (req, res) => res.send("Payment Service healthy"));
app.get("/payments/health", (req, res) => res.send("Payment Service healthy"));

app.use("/payments", paymentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment service port ${PORT}`);
});

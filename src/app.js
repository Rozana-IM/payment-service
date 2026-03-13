const express = require("express");
const cors = require("cors");
const db = require("./db");  // Now does nothing
const paymentRoutes = require("./routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 4002;

// 🔥 CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// 🔥 NO DB CRASH
db.connect();

app.get("/health", (req, res) => res.json({status: "Payment Service healthy"}));
app.get("/payments/health", (req, res) => res.json({status: "Payment Service healthy"}));

app.use("/payments", paymentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment Service LIVE on ${PORT}`);
});

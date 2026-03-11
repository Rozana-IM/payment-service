const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 4002;

/* ================= Middleware ================= */

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));

/* ================= Routes ================= */

app.use(paymentRoutes);

/* ================= Health ================= */

app.get("/payments/health",(req,res)=>{
  res.send("Payment Service Healthy");
});

/* ================= Start ================= */

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`Payment service running on ${PORT}`);
});

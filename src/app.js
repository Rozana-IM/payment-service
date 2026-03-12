const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4002;

/* ================= Middleware ================= */

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

/* ================= DB ================= */

db.connect();

/* ================= Health ================= */

app.get("/payments/health",(req,res)=>{
  res.status(200).send("Payment Service Healthy");
});

/* ================= Routes ================= */

app.use(paymentRoutes);

/* ================= Start ================= */

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`✅ Payment service running on port ${PORT}`);
});

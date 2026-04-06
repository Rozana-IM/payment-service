const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "https://rozana-projects.online",
    "https://www.rozana-projects.online",
    "https://d1u1ckd80xkseo.cloudfront.net"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

/* ================= ROUTES ================= */

// ✅ VERY IMPORTANT (THIS FIXES YOUR ISSUE)
app.use("/payments", paymentRoutes);

/* ================= SERVER ================= */

app.listen(4002, "0.0.0.0", () => {
  console.log("✅ Payment service LIVE on 4002");
});

const express = require("express");
const cors = require("cors");
const db = require("./db");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 4002;

// ✅ SAME CORS
const allowedOrigins = [
  "https://rozana-projects.online",
  "https://d1u1ckd80xkseo.cloudfront.net",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
db.connect();

app.get("/health", (req, res) => res.status(200).send("Payment Service healthy"));
app.get("/payments/health", (req, res) => res.status(200).send("Payment Service healthy"));

app.use("/", paymentRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment service running on port ${PORT}`);
});

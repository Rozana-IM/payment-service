const express = require("express");
const router = express.Router();

const { createPayment, verifyPayment } = require("../controllers/payment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

/* ================= PAYMENT ROUTES ================= */

// POST /payments/create
router.post("/create", verifyToken, createPayment);

// POST /payments/verify
router.post("/verify", verifyToken, verifyPayment);

/* ================= HEALTH ================= */

// GET /payments/health
router.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "payment-service"
  });
});

module.exports = router;

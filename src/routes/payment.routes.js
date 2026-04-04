const express = require("express");
const router = express.Router();

const { createPayment, verifyPayment } = require("../controllers/payment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ✅ FINAL ROUTES
router.post("/create", verifyToken, createPayment);
router.post("/verify", verifyToken, verifyPayment);

router.get("/health", (req, res) => {
  res.json({ status: "Payment service running" });
});

module.exports = router;

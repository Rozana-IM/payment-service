const express = require("express");
const router = express.Router();
const { createPayment, verifyPayment } = require("../controllers/payment.controller");

// 🔥 TEMP - NO AUTH FOR TESTING
router.post("/create", createPayment);
router.post("/verify", verifyPayment);

module.exports = router;

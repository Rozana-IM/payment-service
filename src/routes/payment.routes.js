const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  createPayment,
  verifyPayment
} = require("../controllers/payment.controller");

router.post("/payments/create", verifyToken, createPayment);

router.post("/payments/verify", verifyToken, verifyPayment);

module.exports = router;

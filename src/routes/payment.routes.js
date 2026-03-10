const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const { createPayment } = require("../controllers/payment.controller");

router.post("/payments/create", verifyToken, createPayment);

module.exports = router;

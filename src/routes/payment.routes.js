const express = require("express");
const router = express.Router();
const { createPayment, verifyPayment } = require("../controllers/payment.controller");

const { verifyToken } = require("../middleware/auth.middleware");

router.post("/create", verifyToken, createPayment);
router.post("/verify", verifyToken, verifyPayment);

module.exports = router;

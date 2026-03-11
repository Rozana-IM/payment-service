const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
createPayment,
verifyPayment
} = require("../controllers/payment.controller");

router.post("/payments/create", verifyToken, createPayment);

router.post("/payments/verify", verifyToken, verifyPayment);

router.get("/payments/health",(req,res)=>{
res.send("Payment service healthy");
});

module.exports = router;

const crypto = require("crypto");

const { createRazorpayOrder } = require("../services/razorpay.service");
const { createPaytmPayment } = require("../services/paytm.service");
const { sendPaymentEvent } = require("../services/sqs.service");

// ✅ SAFE IMPORT (won’t crash)
let sendOrderEmail;
try {
  sendOrderEmail = require("../services/email.service").sendOrderEmail;
} catch (err) {
  console.log("⚠️ Email service not loaded");
}

// ================= CREATE PAYMENT =================
exports.createPayment = async (req, res) => {

  const { orderId, amount, method } = req.body;

  if (!orderId || !amount || !method) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  try {

    const paymentAmount = Number(amount);

    // 🔥 RAZORPAY
    if (method === "razorpay") {
      const order = await createRazorpayOrder(orderId, paymentAmount);

      return res.json({
        gateway: "razorpay",
        order
      });
    }

    // 🔥 COD
    if (method === "cod") {

      await sendPaymentEvent({
        type: "PAYMENT_SUCCESS",
        orderId,
        gateway: "cod",
        status: "PENDING"
      });

      // ✅ EMAIL SAFE CALL
      if (req.user?.email && sendOrderEmail) {
        await sendOrderEmail(req.user.email, orderId);
      }

      return res.json({
        gateway: "cod",
        message: "Order placed with Cash on Delivery"
      });
    }

    // 🔥 PAYTM
    if (method === "paytm") {
      const payment = await createPaytmPayment(orderId, paymentAmount);

      return res.json({
        gateway: "paytm",
        payment
      });
    }

    return res.status(400).json({ error: "Invalid payment method" });

  } catch (err) {
    console.error("❌ Payment creation error:", err.message);
    return res.status(500).json({ error: "Payment creation failed" });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing verification details" });
  }

  try {

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      await sendPaymentEvent({
        type: "PAYMENT_SUCCESS",
        orderId,
        paymentId: razorpay_payment_id,
        gateway: "razorpay",
        status: "PAID"
      });

      // ✅ EMAIL SAFE CALL
      if (req.user?.email && sendOrderEmail) {
        await sendOrderEmail(req.user.email, orderId);
      }

      return res.json({
        success: true,
        message: "Payment verified successfully"
      });
    }

    return res.status(400).json({ error: "Payment verification failed" });

  } catch (err) {
    console.error("❌ Verification error:", err.message);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};

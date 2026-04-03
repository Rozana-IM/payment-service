const crypto = require("crypto");
const axios = require("axios");
const { createRazorpayOrder } = require("../services/razorpay.service");

exports.createPayment = async (req, res) => {

  const { orderId, amount, method } = req.body;

  console.log("🔥 BODY:", req.body);

  if (!orderId || !amount || !method) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  try {

    const paymentAmount = Number(amount);
    const paymentMethod = method.toLowerCase();

    console.log("🔥 METHOD:", paymentMethod);

    // ✅ RAZORPAY
    if (paymentMethod === "razorpay") {

      const order = await createRazorpayOrder(orderId, paymentAmount);

      return res.json({
        gateway: "razorpay",
        order
      });
    }

    // ✅ COD
    if (paymentMethod === "cod") {
      return res.json({
        gateway: "cod",
        message: "Order placed with COD"
      });
    }

    // ✅ PAYTM
    if (paymentMethod === "paytm") {
      return res.json({
        gateway: "paytm",
        paymentUrl: `https://securegw.paytm.in/...`
      });
    }

    return res.status(400).json({ error: "Invalid payment method" });

  } catch (err) {
    console.error("❌ Payment error:", err.message);
    return res.status(500).json({ error: "Payment failed" });
  }
};

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

      console.log("✅ PAYMENT VERIFIED:", orderId);

      // 🔥 ADD THIS LINE HERE
      console.log("🚀 Updating order status in order-service...");

      // 🔥 ALSO ADD FULL DEBUG (VERY IMPORTANT)
      console.log("📦 Payload:", {
        orderId,
        status: "PAID",
        paymentId: razorpay_payment_id
      });

      await axios.put(
        "https://api.rozana-projects.online/orders/update-status",
        {
          orderId,
          status: "PAID",
          paymentId: razorpay_payment_id
        }
      );

      console.log("✅ Order status updated successfully");

      return res.json({
        success: true,
        message: "Payment verified & order updated"
      });
    }

    return res.status(400).json({ error: "Invalid signature" });

  } catch (err) {

    // 🔥 IMPROVE ERROR LOG (VERY IMPORTANT)
    console.error("❌ Verify error FULL:", err.response?.data || err.message);

    return res.status(500).json({ error: "Verification failed" });
  }
};

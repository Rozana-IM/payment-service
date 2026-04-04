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

  console.log("🔥 VERIFY BODY:", req.body);

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "Missing verification details" });
  }

  try {

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    console.log("🔐 Expected:", expectedSignature);
    console.log("🔐 Received:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {

      console.log("✅ PAYMENT VERIFIED:", orderId);

      const payload = {
        orderId,
        status: "PAID",
        paymentId: razorpay_payment_id
      };

      console.log("📦 Sending to order-service:", payload);

     let response;

try {

  response = await axios.put(
    `${process.env.ORDER_SERVICE_URL}/orders/update-status`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SERVICE_TOKEN}`
      },
      timeout: 15000
    }
  );

} catch (err) {

  console.log("⚠️ First attempt failed:", err.message);
  console.log("🔁 Retrying...");

  try {

    response = await axios.put(
      `${process.env.ORDER_SERVICE_URL}/orders/update-status`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SERVICE_TOKEN}`
        },
        timeout: 15000
      }
    );

  } catch (retryErr) {

    console.error("❌ Retry failed:", retryErr.message);

    return res.status(500).json({
      error: "Order update failed after retry",
      details: retryErr.message
    });
  }
}

if (!response || !response.data || response.status !== 200) {
  return res.status(500).json({
    error: "Order service failed",
    details: response?.data
  });
}

console.log("✅ Order-service response:", response.data);
      
      return res.json({
        success: true,
        message: "Payment verified & order updated"
      });
    }

    console.log("❌ Signature mismatch");
    return res.status(400).json({ error: "Invalid signature" });

  } catch (err) {

    console.error("❌ AXIOS ERROR FULL:");
    console.error("Message:", err.message);
    console.error("Response:", err.response?.data);
    console.error("Status:", err.response?.status);

    return res.status(500).json({
      error: "Verification failed",
      details: err.message
    });
  }
};

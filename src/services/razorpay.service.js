const Razorpay = require("razorpay");

exports.createRazorpayOrder = async (orderId, amount) => {

  // ✅ CREATE INSTANCE HERE (NOT GLOBAL)
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

  console.log("👉 KEY:", process.env.RAZORPAY_KEY);

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_${orderId}`,
    notes: { orderId }
  };

  return razorpay.orders.create(options);
};

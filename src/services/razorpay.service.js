const Razorpay = require("razorpay");

exports.createRazorpayOrder = async (orderId, amount) => {

  // 🔥 CREATE INSTANCE INSIDE FUNCTION (IMPORTANT)
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

  console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY); // debug

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `lucci_order_${orderId}`,
    notes: { orderId }
  };

  return razorpay.orders.create(options);
};

const Razorpay = require("razorpay");

exports.createRazorpayOrder = async (orderId, amount) => {

  if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    console.error("❌ Razorpay ENV missing");
    throw new Error("Razorpay env missing");
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

  console.log("✅ Razorpay initialized");

  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `order_${orderId}`
  });
};

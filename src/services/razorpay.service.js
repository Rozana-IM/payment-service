const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createRazorpayOrder = async (amount) => {

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "lucci_order_" + Date.now()
  };

  return await razorpay.orders.create(options);
};

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createRazorpayOrder = async (orderId, amount) => {

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `lucci_order_${orderId}`,
    notes: {
      orderId
    }
  };

  return razorpay.orders.create(options);
};

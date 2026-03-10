const crypto = require("crypto");
const axios = require("axios");

const { createRazorpayOrder } = require("../services/razorpay.service");
const { createPaytmPayment } = require("../services/paytm.service");

exports.createPayment = async (req,res)=>{

const { orderId, amount, method } = req.body;

try{

if(method === "razorpay"){

const order = await createRazorpayOrder(amount);

return res.json({
gateway:"razorpay",
order
});

}

if(method === "paytm"){

const payment = await createPaytmPayment(orderId, amount);

return res.json({
gateway:"paytm",
payment
});

}

res.status(400).json({error:"Invalid payment method"});

}catch(err){

console.error(err);

res.status(500).json({error:"Payment creation failed"});

}

};
exports.verifyPayment = async (req,res)=>{

const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

try{

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
.createHmac("sha256", process.env.RAZORPAY_SECRET)
.update(body.toString())
.digest("hex");

if(expectedSignature === razorpay_signature){

// ✅ PAYMENT VALID

await axios.post(`${process.env.ORDER_SERVICE_URL}/orders/payment-update`,{
orderId,
status:"PAID"
});

return res.json({
message:"Payment verified successfully"
});

}

return res.status(400).json({
error:"Payment verification failed"
});

}catch(err){

console.error("Verification error:",err.message);

res.status(500).json({
error:"Payment verification failed"
});

}

};

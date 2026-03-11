const crypto = require("crypto");

const { createRazorpayOrder } = require("../services/razorpay.service");
const { createPaytmPayment } = require("../services/paytm.service");
const { sendPaymentEvent } = require("../services/sqs.service");

exports.createPayment = async (req,res)=>{

const { orderId, amount, method } = req.body;

if(!orderId || !amount || !method){
return res.status(400).json({
error:"Missing payment details"
});
}

try{

if(method === "razorpay"){

// Razorpay requires paise
const order = await createRazorpayOrder(amount * 100);

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

return res.status(400).json({
error:"Invalid payment method"
});

}catch(err){

console.error("Payment creation error:",err.message);

res.status(500).json({
error:"Payment creation failed"
});

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

// PAYMENT VALID

await sendPaymentEvent({
type: "PAYMENT_SUCCESS",
orderId,
paymentId: razorpay_payment_id,
status: "PAID"
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

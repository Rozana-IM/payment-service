const crypto = require("crypto");

const { createRazorpayOrder } = require("../services/razorpay.service");
const { createPaytmPayment } = require("../services/paytm.service");
const { sendPaymentEvent } = require("../services/sqs.service");


/* =================================================
   CREATE PAYMENT
================================================= */

exports.createPayment = async (req,res)=>{

const { orderId, amount, method } = req.body;
const userId = req.user?.id;

if(!orderId || !amount || !method){
return res.status(400).json({
error:"Missing payment details"
});
}

if(!userId){
return res.status(401).json({
error:"Unauthorized"
});
}

try{

const paymentAmount = Number(amount);

if(isNaN(paymentAmount)){
return res.status(400).json({
error:"Invalid payment amount"
});
}

/* ================= RAZORPAY ================= */

if(method === "razorpay"){

// Razorpay requires amount in paise
const order = await createRazorpayOrder(paymentAmount * 100);

return res.json({
gateway:"razorpay",
order
});

}

/* ================= PAYTM ================= */

if(method === "paytm"){

const payment = await createPaytmPayment(orderId, paymentAmount);

return res.json({
gateway:"paytm",
payment
});

}

return res.status(400).json({
error:"Invalid payment method"
});

}catch(err){

console.error("❌ Payment creation error:",err.message);

return res.status(500).json({
error:"Payment creation failed"
});

}

};



/* =================================================
   VERIFY PAYMENT
================================================= */

exports.verifyPayment = async (req,res)=>{

const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

if(!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
return res.status(400).json({
error:"Missing verification details"
});
}

try{

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
.createHmac("sha256", process.env.RAZORPAY_SECRET)
.update(body.toString())
.digest("hex");

if(expectedSignature === razorpay_signature){

/* SEND EVENT TO SQS */

await sendPaymentEvent({
type:"PAYMENT_SUCCESS",
orderId,
paymentId: razorpay_payment_id,
gateway:"razorpay",
status:"PAID"
});

return res.json({
success:true,
message:"Payment verified successfully"
});

}

return res.status(400).json({
error:"Payment verification failed"
});

}catch(err){

console.error("❌ Verification error:",err.message);

return res.status(500).json({
error:"Payment verification failed"
});

}

};

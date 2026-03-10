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

exports.createPaytmPayment = async (orderId, amount) => {

  const paymentUrl = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;

  return {
    gateway: "paytm",
    payment: {
      paymentUrl: paymentUrl,
      orderId: orderId,
      amount: amount
    }
  };

};

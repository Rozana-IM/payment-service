const axios = require("axios");

exports.createPaytmPayment = async (orderId, amount) => {

  return {
    paymentUrl: `https://secure.paytm.in/order/${orderId}`,
    amount
  };

};

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOrderEmail = async (email, orderId) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "LUCCI Order Confirmation",
    html: `
      <h2>Order Confirmed 🎉</h2>
      <p>Your order ID: <b>${orderId}</b></p>
      <p>Your delivery will arrive in 2 days 🚚</p>
    `
  });

};

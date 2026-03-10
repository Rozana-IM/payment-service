const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(express.json());

app.use(cors({
origin:process.env.FRONTEND_URL || "https://rozana-projects.online",
credentials:true
}));

app.use(paymentRoutes);

app.get("/payments/health",(req,res)=>{
res.send("Payment Service healthy");
});

const PORT = process.env.PORT || 4002;

app.listen(PORT,"0.0.0.0",()=>{
console.log(`Payment service running on ${PORT}`);
});

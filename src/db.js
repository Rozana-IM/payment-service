// Payment service doesn't need DB - uses order-service database
// All orders table operations handled by order-service

module.exports = {
  connect: () => {
    console.log("✅ Payment service - DB disabled (not needed)");
  }
};

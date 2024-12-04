const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  pointsUsed: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  pointsExpiryDate: { type: Date },
  purchaseDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

//module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);

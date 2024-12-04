const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // In rupees
});

//module.exports = mongoose.model("Product", productSchema);
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    loyaltyPoints: { type: Number, default: 0 }, // New field for tracking user points
  },
  { timestamps: true }
);

// Check if the model is already compiled
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

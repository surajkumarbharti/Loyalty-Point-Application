const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const deductPointsFIFO = require("../utils/deductPointsFIFO");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { userId, productId, quantity, pointsToUse } = req.body;

  try {
    // Fetch user and product details
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found" });
    }

    // Calculate total price for the quantity
    const totalPrice = product.price * quantity;

    // Define points usage conditions
    let maxPointsAllowed = 0;
    if (totalPrice >= 100 && totalPrice <= 149) maxPointsAllowed = 50;
    else if (totalPrice >= 150 && totalPrice <= 249) maxPointsAllowed = 100;
    else if (totalPrice >= 250 && totalPrice <= 349) maxPointsAllowed = 120;
    else if (totalPrice >= 350 && totalPrice <= 699) maxPointsAllowed = 200;

    // Check if the user tries to use more points than allowed
    if (pointsToUse > maxPointsAllowed) {
      return res.status(400).json({
        message: `Cannot use more than ${maxPointsAllowed} points for a product in the price range of ${totalPrice}.`,
      });
    }

    // Check if the user has enough points
    if (pointsToUse > user.loyaltyPoints) {
      return res
        .status(400)
        .json({ message: "Insufficient points to complete the transaction." });
    }

    // Deduct points and calculate final price
    const finalPrice = totalPrice - pointsToUse;

    // If the final price is less than 100, no points should be earned
    let pointsEarned = 0;
    if (finalPrice >= 100 && finalPrice <= 149) pointsEarned = 50;
    else if (finalPrice >= 150 && finalPrice <= 249) pointsEarned = 100;
    else if (finalPrice >= 250 && finalPrice <= 349) pointsEarned = 120;
    else if (finalPrice >= 350 && finalPrice <= 699) pointsEarned = 200;

    // Deduct points using FIFO logic
    if (pointsToUse > 0) {
      const pointsDeductionResult = await deductPointsFIFO(userId, pointsToUse);
      if (!pointsDeductionResult.success) {
        return res.status(500).json({
          message: "Error deducting points: " + pointsDeductionResult.message,
        });
      }
    }

    // Create the order
    const pointsExpiryDate = new Date();
    pointsExpiryDate.setDate(pointsExpiryDate.getDate() + 10); // Points expire in 10 days

    const newOrder = new Order({
      userId,
      productId,
      quantity,
      totalPrice,
      pointsUsed: pointsToUse,
      pointsEarned,
      pointsExpiryDate,
      purchaseDate: new Date(),
    });

    await newOrder.save();

    // Update user loyalty points (deduction already handled; add earned points)
    user.loyaltyPoints -= pointsToUse;
    user.loyaltyPoints += pointsEarned;
    await user.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      finalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;

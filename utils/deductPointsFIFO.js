const User = require("../models/User");

const deductPointsFIFO = async (userId, pointsToDeduct) => {
  try {
    const user = await User.findById(userId);

    if (!user || user.loyaltyPoints < pointsToDeduct) {
      return { success: false, message: "User or points data not found." };
    }

    // Deduct points
    user.loyaltyPoints -= pointsToDeduct;

    // Save user after deduction
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Error in deductPointsFIFO:", error);
    return { success: false, message: error.message };
  }
};

module.exports = deductPointsFIFO;

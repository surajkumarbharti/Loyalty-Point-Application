const cron = require("node-cron");
const User = require("../models/User");
const Order = require("../models/Order");

cron.schedule("0 0 * * *", async () => {
  const currentDate = new Date();

  // Find all orders with expired points
  const expiredOrders = await Order.find({ pointsExpiryDate: { $lt: currentDate } });

  for (const order of expiredOrders) {
    const user = await User.findById(order.userId);
    if (user) {
      user.remainingPoints -= order.pointsEarned;
      if (user.remainingPoints < 0) user.remainingPoints = 0;
      await user.save();
    }
  }
});

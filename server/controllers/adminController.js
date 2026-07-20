// Admin controller for summary statistics
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get admin dashboard summary
// @route   GET /api/admin/summary
// @access  Admin only
const getSummary = asyncHandler(async (req, res) => {
  // Total orders count
  const totalOrders = await Order.countDocuments();
  // Total revenue sum of totalPrice
  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAgg[0] ? revenueAgg[0].total : 0;
  // Total products count
  const totalProducts = await Product.countDocuments();
  // Total customers (users with role 'customer')
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  res.json({
    success: true,
    summary: {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
    },
  });
});

module.exports = { getSummary };

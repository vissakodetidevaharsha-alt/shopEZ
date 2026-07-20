const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.use(protect); // All order routes require authentication

router.route('/')
  .post(createOrder)
  .get(admin, getOrders); // Admin only to view all orders

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(admin, updateOrderStatus); // Admin only to update status

router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, getOrderById } = require('../controllers/orderController');
const { protect, admin, optionalAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, addOrderItems)
  .get(protect, requireRole(['superadmin', 'admin', 'manager']), getOrders);
  
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderStatus);

module.exports = router;

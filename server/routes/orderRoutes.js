const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, optionalAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, addOrderItems)
  .get(protect, requireRole(['superadmin', 'admin', 'manager']), getOrders);
  
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderStatus);

module.exports = router;

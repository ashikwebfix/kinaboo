const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, getOrderById, bulkUpdateOrderStatus, bulkDeleteOrders } = require('../controllers/orderController');
const { protect, admin, optionalAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, addOrderItems)
  .get(protect, requireRole(['superadmin', 'admin', 'manager']), getOrders);
  
router.route('/bulk/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), bulkUpdateOrderStatus);
router.route('/bulk').delete(protect, requireRole(['superadmin', 'admin', 'manager']), bulkDeleteOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderStatus);

module.exports = router;

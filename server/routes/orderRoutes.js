const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, updateOrderShipping, updateOrderItems, getOrderById, bulkUpdateOrderStatus, bulkDeleteOrders, deleteOrder } = require('../controllers/orderController');
const { protect, admin, optionalAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, addOrderItems)
  .get(protect, requireRole(['superadmin', 'admin', 'manager']), getOrders);
  
router.route('/bulk/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), bulkUpdateOrderStatus);
router.route('/bulk').delete(protect, requireRole(['superadmin', 'admin', 'manager']), bulkDeleteOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id')
  .get(getOrderById)
  .delete(protect, requireRole(['superadmin']), deleteOrder);
router.route('/:id/status').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderStatus);
router.route('/:id/shipping').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderShipping);
router.route('/:id/items').put(protect, requireRole(['superadmin', 'admin', 'manager']), updateOrderItems);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getProducts, getAdminProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkDeleteProducts, bulkUpdateStatus } = require('../controllers/productController');
const { protect, admin, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/admin')
  .get(protect, requireRole(['superadmin', 'admin', 'manager']), getAdminProducts);

router.route('/bulk')
  .delete(protect, admin, bulkDeleteProducts);

router.route('/bulk/status')
  .put(protect, admin, bulkUpdateStatus);

router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;

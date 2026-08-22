const express = require('express');
const router = express.Router();
const { getCities, getZones, getAreas, createConsignment, getTracking } = require('../controllers/pathaoController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/cities', protect, admin, getCities);
router.get('/zones/:city_id', protect, admin, getZones);
router.get('/areas/:zone_id', protect, admin, getAreas);
router.post('/create-order/:orderId', protect, admin, createConsignment);
router.get('/tracking/:consignment_id', protect, getTracking); // Allow users to track their own

module.exports = router;

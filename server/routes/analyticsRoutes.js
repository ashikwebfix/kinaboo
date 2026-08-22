const express = require('express');
const router = express.Router();
const { initSession, trackPageview, trackClicks, getDashboardStats, sendCAPIEvent } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/init', initSession);
router.post('/pageview', trackPageview);
router.post('/click', trackClicks);
router.post('/capi', sendCAPIEvent);
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;

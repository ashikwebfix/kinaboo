const express = require('express');
const router = express.Router();
const { getSettingByKey, updateSetting } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:key', getSettingByKey);
router.put('/:key', protect, admin, updateSetting);

module.exports = router;

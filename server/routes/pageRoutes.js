const express = require('express');
const router = express.Router();
const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} = require('../controllers/pageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPages)
  .post(protect, admin, createPage);

router.route('/:slug')
  .get(getPageBySlug);

router.route('/:id')
  .put(protect, admin, updatePage)
  .delete(protect, admin, deletePage);

module.exports = router;

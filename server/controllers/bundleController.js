const Bundle = require('../models/Bundle');

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
const getBundles = async (req, res) => {
  try {
    const bundles = await Bundle.findAll();
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bundle by ID
// @route   GET /api/bundles/:id
// @access  Public
const getBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findByPk(req.params.id);
    if (bundle) {
      res.json(bundle);
    } else {
      res.status(404).json({ message: 'Bundle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active bundles for a specific product
// @route   GET /api/bundles/product/:productId
// @access  Public
const getBundlesByProductId = async (req, res) => {
  try {
    // Find combo/volume bundles where mainProductId matches
    const bundles = await Bundle.findAll({
      where: {
        mainProductId: req.params.productId,
        isActive: true
      }
    });
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bundle
// @route   POST /api/bundles
// @access  Private/Admin
const createBundle = async (req, res) => {
  try {
    const bundle = await Bundle.create(req.body);
    res.status(201).json(bundle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a bundle
// @route   PUT /api/bundles/:id
// @access  Private/Admin
const updateBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByPk(req.params.id);
    if (bundle) {
      await bundle.update(req.body);
      res.json(bundle);
    } else {
      res.status(404).json({ message: 'Bundle not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a bundle
// @route   DELETE /api/bundles/:id
// @access  Private/Admin
const deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByPk(req.params.id);
    if (bundle) {
      await bundle.destroy();
      res.json({ message: 'Bundle removed' });
    } else {
      res.status(404).json({ message: 'Bundle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBundles,
  getBundleById,
  getBundlesByProductId,
  createBundle,
  updateBundle,
  deleteBundle
};

const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { title, subtitle, description, image } = req.body;
  try {
    const category = await Category.create({ title, subtitle, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { title, subtitle, description, image } = req.body;
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      category.title = title || category.title;
      category.subtitle = subtitle || category.subtitle;
      category.description = description || category.description;
      category.image = image || category.image;
      await category.save();
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

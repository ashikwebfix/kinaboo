const { Op } = require('sequelize');
const Product = require('../models/Product');

// Helper: generate a URL-friendly slug from a product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .replace(/\s+/g, '-')           // spaces -> hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-BDT/g, '');         // trim leading/trailing hyphens
};

// Ensure slug is unique by appending a counter if needed
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const existing = await Product.findOne({ where });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const getProducts = async (req, res) => {
  const { search } = req.query;
  const where = { status: 'published' };
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { category: { [Op.like]: `%${search}%` } },
      { tags: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const products = await Product.findAll({ where });
  res.json(products);
};

const getAdminProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

const getProductById = async (req, res) => {
  const identifier = req.params.id;
  
  // Try by slug first, then by UUID
  let product = await Product.findOne({ where: { slug: identifier } });
  if (!product) {
    product = await Product.findByPk(identifier);
  }
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, price, sellPrice, description, longDescription, image, images, category, stock, allowSellWithoutStock, keypoints, variations, faq, imageTextSections, tags, status, volumeBundles, configurator } = req.body;
    
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);
    
    const product = await Product.create({
      name, slug, sku, price, sellPrice, description, longDescription, image, images, category, stock, allowSellWithoutStock, keypoints, variations, faq, imageTextSections, tags, status, volumeBundles, configurator
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, sku, price, sellPrice, description, longDescription, image, images, category, stock, allowSellWithoutStock, keypoints, variations, faq, imageTextSections, tags, status, volumeBundles, configurator } = req.body;
  const product = await Product.findByPk(req.params.id);

  if (product) {
    // Regenerate slug if name changed
    if (name && name !== product.name) {
      const baseSlug = generateSlug(name);
      product.slug = await ensureUniqueSlug(baseSlug, product.id);
    }
    
    product.name = name || product.name;
    product.sku = sku !== undefined ? sku : product.sku;
    product.price = price || product.price;
    product.sellPrice = sellPrice !== undefined ? sellPrice : product.sellPrice;
    product.description = description || product.description;
    product.longDescription = longDescription || product.longDescription;
    product.image = image || product.image;
    product.images = images || product.images;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.allowSellWithoutStock = allowSellWithoutStock !== undefined ? allowSellWithoutStock : product.allowSellWithoutStock;
    product.keypoints = keypoints || product.keypoints;
    product.variations = variations || product.variations;
    product.faq = faq || product.faq;
    product.imageTextSections = imageTextSections || product.imageTextSections;
    product.tags = tags || product.tags;
    product.status = status || product.status;
    product.volumeBundles = volumeBundles !== undefined ? volumeBundles : product.volumeBundles;
    product.configurator = configurator !== undefined ? configurator : product.configurator;

    await product.save();
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (product) {
    await product.destroy();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// One-time migration: Generate slugs for existing products that don't have one
const migrateProductSlugs = async () => {
  try {
    const products = await Product.findAll({ where: { slug: null } });
    for (const product of products) {
      const baseSlug = generateSlug(product.name);
      product.slug = await ensureUniqueSlug(baseSlug, product.id);
      await product.save();
    }
    if (products.length > 0) {
      console.log(`Generated slugs for ${products.length} existing product(s).`);
    }
  } catch (error) {
    console.error('Error migrating slugs:', error.message);
  }
};

const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No product IDs provided' });
  }

  try {
    await Product.destroy({
      where: {
        id: ids
      }
    });
    res.json({ message: 'Products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkUpdateStatus = async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No product IDs provided' });
  }

  try {
    await Product.update(
      { status },
      { where: { id: ids } }
    );
    res.json({ message: 'Product statuses updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  migrateProductSlugs,
  bulkDeleteProducts,
  bulkUpdateStatus
};

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sellPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  allowSellWithoutStock: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  keypoints: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  variations: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  longDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  faq: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  imageTextSections: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'published', // 'published' or 'draft'
  },
  volumeBundles: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  configurator: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Product;

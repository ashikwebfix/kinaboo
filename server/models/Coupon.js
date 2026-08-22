const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    defaultValue: 'percentage',
  },
  discountValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  minPurchaseAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  applicableProducts: {
    type: DataTypes.JSON,
    allowNull: true, // Array of product IDs
  },
  applicableCategories: {
    type: DataTypes.JSON,
    allowNull: true, // Array of category names
  },
  applicableCustomers: {
    type: DataTypes.JSON,
    allowNull: true, // Array of customer emails
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = Coupon;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bundle = sequelize.define('Bundle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'combo', // 'combo' or 'volume'
  },
  mainProductId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  products: {
    type: DataTypes.JSON, // Array of product IDs for combo
    allowNull: true,
  },
  volumeTiers: {
    type: DataTypes.JSON, // Array of {qty: 2, discount: 10} for volume
    allowNull: true,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'percentage', // 'percentage' or 'fixed'
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
});

module.exports = Bundle;

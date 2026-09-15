const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AbandonedCart = sequelize.define('AbandonedCart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cartData: {
    type: DataTypes.JSON,
    allowNull: false
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('abandoned', 'recovered'),
    defaultValue: 'abandoned'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fbp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fbc: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = AbandonedCart;

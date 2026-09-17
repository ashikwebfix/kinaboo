const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  linkedProductIds: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Admin'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'published'
  }
}, {
  timestamps: true,
});

module.exports = Blog;

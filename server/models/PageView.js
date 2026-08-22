const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Visitor = require('./Visitor');

const PageView = sequelize.define('PageView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  visitorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Visitor,
      key: 'id'
    }
  },
  pageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Visitor.hasMany(PageView, { foreignKey: 'visitorId', as: 'pageViews' });
PageView.belongsTo(Visitor, { foreignKey: 'visitorId', as: 'visitor' });

module.exports = PageView;

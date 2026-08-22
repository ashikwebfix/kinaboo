const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Visitor = require('./Visitor');

const ClickEvent = sequelize.define('ClickEvent', {
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
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  screenWidth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  screenHeight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Visitor.hasMany(ClickEvent, { foreignKey: 'visitorId', as: 'clicks' });
ClickEvent.belongsTo(Visitor, { foreignKey: 'visitorId', as: 'visitor' });

module.exports = ClickEvent;

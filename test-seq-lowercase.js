const { sequelize } = require('./server/config/db');
const Order = require('./server/models/Order');
console.log('Order table name:', Order.tableName);
process.exit(0);

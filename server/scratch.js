const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ecommerce_db', 'root', 'root', { host: '127.0.0.1', dialect: 'mysql' });
const Product = require('./models/Product');
(async () => {
  const p = await Product.findOne();
  p.allowSellWithoutStock = true;
  await p.save();
  const p2 = await Product.findOne();
  console.log(p2.toJSON());
  process.exit();
})();

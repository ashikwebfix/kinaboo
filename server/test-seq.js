const { Op } = require('sequelize');
const Product = require('./models/Product');
const { connectDB } = require('./config/db');

async function run() {
  await connectDB();
  const search = 'headphone';
  const where = { status: 'published' };
  where[Op.or] = [
    { name: { [Op.like]: `%${search}%` } },
    { category: { [Op.like]: `%${search}%` } },
    { tags: { [Op.like]: `%${search}%` } }
  ];
  
  const products = await Product.findAll({ where, logging: console.log });
  console.log(products.map(p => p.name));
  process.exit(0);
}
run();

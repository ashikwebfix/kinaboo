const { sequelize } = require('./server/config/db');
const Product = require('./server/models/Product');

async function test() {
  const p = await Product.findByPk('a015b6f5-65f8-4c2a-8cc0-4722b8d835af');
  console.log(p ? 'Product exists' : 'Product does not exist');
  process.exit();
}
test();

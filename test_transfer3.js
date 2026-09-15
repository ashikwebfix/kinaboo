const { sequelize } = require('./server/config/db');
const AbandonedCart = require('./server/models/AbandonedCart');

async function test() {
  const cart = await AbandonedCart.findOne({ where: { status: 'abandoned' } });
  if (!cart) return console.log('No abandoned cart found');
  
  console.log(cart.cartData);
  process.exit();
}
test();

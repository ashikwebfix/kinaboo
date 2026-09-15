const { sequelize } = require('./server/config/db');
const AbandonedCart = require('./server/models/AbandonedCart');
const Order = require('./server/models/Order');
const OrderItem = require('./server/models/OrderItem');
const Product = require('./server/models/Product');

async function test() {
  const cart = await AbandonedCart.findOne({ where: { status: 'abandoned' } });
  if (!cart) return console.log('No abandoned cart found');
  
  const orderItemsData = cart.cartData.map((item) => ({
    orderId: '69e8a774-9d89-46d2-ba27-b785d1a51ab5',
    productId: item.productId || item.id,
    qty: item.qty,
    price: item.price || item.sellPrice,
    selectedVariations: item.selectedVariations || null
  }));

  try {
    await OrderItem.bulkCreate(orderItemsData);
    console.log('Order items created successfully');
  } catch (error) {
    console.error('Error creating order items:', error.message);
  }
  process.exit();
}
test();

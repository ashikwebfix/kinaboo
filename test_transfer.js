const { sequelize } = require('./server/config/db');
const AbandonedCart = require('./server/models/AbandonedCart');
const Order = require('./server/models/Order');
const OrderItem = require('./server/models/OrderItem');

async function test() {
  const cart = await AbandonedCart.findOne({ where: { status: 'abandoned' } });
  if (!cart) return console.log('No abandoned cart found');
  
  console.log('Transferring cart', cart.id);
  
  try {
    const order = await Order.create({
      userId: null,
      name: 'Test',
      phone: cart.phone,
      shippingAddress: 'Test Address',
      city: 'Test City',
      postalCode: '',
      ipAddress: cart.ipAddress,
      userAgent: cart.userAgent,
      totalPrice: Number(cart.totalValue) - 0 + 0,
      paymentMethod: 'Cash on Delivery',
      shippingCost: 0,
      discount: 0,
      couponCode: null,
      status: 'Pending',
      statusLogs: [{
        status: 'Pending',
        date: new Date().toISOString(),
        note: 'Order transferred from abandoned cart'
      }]
    });
    
    console.log('Order created', order.id);
  } catch (error) {
    console.error('Error creating order:', error.message, error.stack);
  }
  process.exit();
}
test();

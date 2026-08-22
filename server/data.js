let products = [
  { id: '1', name: 'Premium Wireless Headphones', price: 299.99, description: 'High-fidelity audio with active noise cancellation.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', category: 'Electronics', stock: 15 },
  { id: '2', name: 'Minimalist Smartwatch', price: 199.50, description: 'Track your health in style with our new minimalist smartwatch.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop', category: 'Wearables', stock: 30 },
  { id: '3', name: 'Ergonomic Desk Chair', price: 149.00, description: 'Designed for comfort during those long work sessions.', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop', category: 'Furniture', stock: 5 },
  { id: '4', name: 'Mechanical Keyboard', price: 129.99, description: 'Tactile switches for the ultimate typing experience.', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop', category: 'Accessories', stock: 0 }
];

let users = [
  // Admin user
  { id: '1', name: 'Admin User', email: 'admin@site.com', password: 'password123', isAdmin: true },
  // Regular user
  { id: '2', name: 'John Doe', email: 'john@site.com', password: 'password123', isAdmin: false }
];

let orders = [
  { id: '101', user: '2', orderItems: [{ name: 'Premium Wireless Headphones', qty: 1, price: 299.99 }], totalPrice: 299.99, isPaid: true, paidAt: new Date().toISOString() }
];

module.exports = { products, users, orders };

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

// Mock browser globals for SSR using JSDOM
const { JSDOM } = require('jsdom');
const siteUrl = process.env.SITE_URL || 'http://localhost:6711';
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>', { url: siteUrl });
const win = dom.window;

for (const key of Object.getOwnPropertyNames(win)) {
  if (typeof global[key] === 'undefined') {
    global[key] = win[key];
  }
}

global.window = win;
global.document = win.document;
global.navigator = win.navigator;
global.location = win.location;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingRoutes = require('./routes/settingRoutes');
const couponRoutes = require('./routes/couponRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const pathaoRoutes = require('./routes/pathaoRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const abandonedCartRoutes = require('./routes/abandonedCartRoutes');
const pageRoutes = require('./routes/pageRoutes');
const blogRoutes = require('./routes/blogRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const fs = require('fs');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Blog = require('./models/Blog');

const { migrateProductSlugs } = require('./controllers/productController');


const { sequelize } = require('./config/db');

// Safe DB migrations - adds missing columns without breaking existing data
const runMigrations = async () => {
  const safeAlter = async (table, column, definition) => {
    try {
      const [cols] = await sequelize.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
      if (cols.length === 0) {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`[Migration] Added ${column} to ${table}`);
      }
    } catch (err) {
      console.error(`[Migration] Failed to add ${column} to ${table}:`, err.message);
    }
  };

  await safeAlter('Users', 'fcmToken', 'TEXT NULL');
  await safeAlter('Products', 'reviews', 'JSON NULL');
  await safeAlter('Products', 'youtubeReels', 'JSON NULL');
  await safeAlter('Products', 'variationCombinations', 'JSON NULL');
  await safeAlter('Products', 'unitText', 'VARCHAR(255) NULL');
  await safeAlter('Products', 'singleBundle', 'JSON NULL');
  await safeAlter('Users', 'phone', 'VARCHAR(255) NULL');
  await safeAlter('Users', 'address', 'TEXT NULL');
  await safeAlter('AbandonedCarts', 'fbp', 'VARCHAR(255) NULL');
  await safeAlter('AbandonedCarts', 'fbc', 'VARCHAR(255) NULL');
  await safeAlter('AbandonedCarts', 'ipAddress', 'VARCHAR(255) NULL');
  await safeAlter('AbandonedCarts', 'userAgent', 'VARCHAR(255) NULL');
  await safeAlter('AbandonedCarts', 'name', 'VARCHAR(255) NULL');
  
  // Sync new models
  await Blog.sync();
  console.log('[Migration] Synced Blog model.');

  console.log('[Migration] All migrations complete.');
};

// Connect to database and run migrations
connectDB().then(() => {
  migrateProductSlugs();
  runMigrations();
});

const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', mediaRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/pathao', pathaoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/abandoned-carts', abandonedCartRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/subscribers', subscriberRoutes);

// API Fallback (Optional - send 404 for unknown API routes)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Serve frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist/client');
app.use(express.static(frontendDistPath, { index: false }));

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
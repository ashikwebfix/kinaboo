const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

// Mock browser globals for SSR using JSDOM
const { JSDOM } = require('jsdom');
const siteUrl = process.env.SITE_URL;
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
const fs = require('fs');
const Product = require('./models/Product');
const Category = require('./models/Category');

const { migrateProductSlugs } = require('./controllers/productController');


// Connect to database and run migrations
connectDB().then(() => {
  migrateProductSlugs();
});

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

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

// API Fallback (Optional - send 404 for unknown API routes)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

/*
// Serve frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist/client');
app.use(express.static(frontendDistPath, { index: false }));

// Catch-all route for SPA and SEO injection
app.use(async (req, res) => {
  try {
    let html = fs.readFileSync(path.join(frontendDistPath, 'index.html'), 'utf-8');
    const currentPath = req.path;
    
    let title = "পছন্দের পণ্য বেছে নিন | kinaboo.com";
    let description = "পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।";
    let image = `${process.env.SITE_URL || 'http://localhost:6711'}/favicon.svg`;

    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.split('/')[2];
      const product = await Product.findOne({ where: { slug } });
      
      if (product) {
        title = `${product.name} | kinaboo.com`;
        const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
        const cleanDesc = stripHtml(product.description || product.longDescription);
        description = cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + '...' : cleanDesc;
        
        let pImage = product.image;
        if (product.images && product.images.length > 0 && !pImage) pImage = product.images[0];
        if (pImage) image = pImage.startsWith('http') ? pImage : `${process.env.SITE_URL || 'http://localhost:6710'}${pImage.startsWith('/') ? '' : '/'}${pImage}`;
      }
    } else if (currentPath === '/categories') {
      title = "Categories | kinaboo.com";
      description = "Explore our wide range of product categories.";
    }

    const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />`;

    html = html.replace('<title>পছন্দের পণ্য বেছে নিন | kinaboo.com</title>', ogTags);
    
    // SSR Rendering
    try {
      const renderModulePath = path.join(__dirname, '../frontend/dist/server/entry-server.js');
      // Add cache buster for development so it picks up new builds without restarting Node
      const cacheBuster = process.env.NODE_ENV === 'production' ? '' : `?update=${Date.now()}`;
      const { render } = await import(`file://${renderModulePath}${cacheBuster}`);
      const { html: appHtml } = render(req.originalUrl);
      html = html.replace('<!--app-html-->', appHtml);
    } catch (ssrError) {
      console.error('SSR Error:', ssrError);
      // fallback to CSR
    }

    res.send(html);
  } catch (error) {
    console.error('Error rendering page:', error);
    // Fallback to basic HTML if there is an error
    try {
        res.send(fs.readFileSync(path.join(frontendDistPath, 'index.html'), 'utf-8'));
    } catch(e) {
        res.status(500).send('Server Error');
    }
  }
});
*/

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

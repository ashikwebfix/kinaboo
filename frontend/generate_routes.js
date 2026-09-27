const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'page.jsx', view: 'Home', folder: '' },
  { path: 'shop/page.jsx', view: 'Shop', folder: 'shop' },
  { path: 'categories/page.jsx', view: 'Categories', folder: 'categories' },
  { path: 'search/page.jsx', view: 'SearchResults', folder: 'search' },
  { path: 'product/[slug]/page.jsx', view: 'ProductDetails', folder: 'product/[slug]' },
  { path: 'blog/[slug]/page.jsx', view: 'BlogView', folder: 'blog/[slug]' },
  { path: 'pages/[slug]/page.jsx', view: 'DynamicPage', folder: 'pages/[slug]' },
  { path: 'login/page.jsx', view: 'Login', folder: 'login' },
  { path: 'profile/page.jsx', view: 'Profile', folder: 'profile' },
  { path: 'cart/page.jsx', view: 'Cart', folder: 'cart' },
  { path: 'checkout/page.jsx', view: 'Checkout', folder: 'checkout' },
  { path: 'l/[slug]/page.jsx', view: 'ProductLanding', folder: 'l/[slug]' },
  { path: 'thank-you/[id]/page.jsx', view: 'ThankYou', folder: 'thank-you/[id]' },
  
  // Admin Routes
  { path: 'admin/layout.jsx', view: 'AdminLayout', isLayout: true, folder: 'admin' },
  { path: 'admin/login/page.jsx', view: 'admin/AdminLogin', folder: 'admin/login' },
  { path: 'admin/page.jsx', view: 'admin/Dashboard', folder: 'admin' },
  { path: 'admin/orders/page.jsx', view: 'admin/AdminOrders', folder: 'admin/orders' },
  { path: 'admin/orders/[id]/page.jsx', view: 'admin/AdminOrderDetails', folder: 'admin/orders/[id]' },
  { path: 'admin/customers/page.jsx', view: 'admin/AdminCustomers', folder: 'admin/customers' },
  { path: 'admin/analytics/page.jsx', view: 'admin/AdminAnalytics', folder: 'admin/analytics' },
  { path: 'admin/abandoned-carts/page.jsx', view: 'admin/AdminAbandonedCarts', folder: 'admin/abandoned-carts' },
  { path: 'admin/products/page.jsx', view: 'admin/AdminProducts', folder: 'admin/products' },
  { path: 'admin/products/new/page.jsx', view: 'admin/AdminProductForm', folder: 'admin/products/new' },
  { path: 'admin/products/edit/[id]/page.jsx', view: 'admin/AdminProductForm', folder: 'admin/products/edit/[id]' },
  { path: 'admin/categories/page.jsx', view: 'admin/AdminCategories', folder: 'admin/categories' },
  { path: 'admin/media/page.jsx', view: 'admin/AdminMedia', folder: 'admin/media' },
  { path: 'admin/settings/page.jsx', view: 'admin/AdminSettings', folder: 'admin/settings' },
  { path: 'admin/coupons/page.jsx', view: 'admin/AdminCoupons', folder: 'admin/coupons' },
  { path: 'admin/bundles/page.jsx', view: 'admin/AdminBundles', folder: 'admin/bundles' },
  { path: 'admin/bundles/new/page.jsx', view: 'admin/AdminBundleForm', folder: 'admin/bundles/new' },
  { path: 'admin/bundles/edit/[id]/page.jsx', view: 'admin/AdminBundleForm', folder: 'admin/bundles/edit/[id]' },
  { path: 'admin/fraud-protection/page.jsx', view: 'admin/AdminFraudProtection', folder: 'admin/fraud-protection' },
  { path: 'admin/users/page.jsx', view: 'admin/AdminUsers', folder: 'admin/users' },
  { path: 'admin/pages/page.jsx', view: 'admin/AdminPages', folder: 'admin/pages' },
  { path: 'admin/blogs/page.jsx', view: 'admin/AdminBlogs', folder: 'admin/blogs' }
];

const generateRoutes = () => {
    routes.forEach(route => {
        const fullDirPath = path.join('./src/app', route.folder);
        if (route.folder && !fs.existsSync(fullDirPath)) {
            fs.mkdirSync(fullDirPath, { recursive: true });
        }

        const fullPath = path.join('./src/app', route.path);
        
        // Calculate relative path to views (from src/app/... back to src/views)
        const depth = route.path.split('/').length - 1;
        let relativePrefix = '../'.repeat(depth + 1); // e.g., if in src/app/shop, depth is 1, so ../../views
        
        let content = '';
        if (route.isLayout) {
          content = `"use client";\nimport AdminLayout from '${relativePrefix}components/AdminLayout';\n\nexport default function Layout({ children }) {\n  return <AdminLayout>{children}</AdminLayout>;\n}\n`;
        } else {
          let viewPath = route.view.startsWith('admin/') 
              ? `${relativePrefix}views/${route.view}`
              : `${relativePrefix}views/${route.view}`;
          
          content = `"use client";\nimport View from '${viewPath}';\n\nexport default function Page() {\n  return <View />;\n}\n`;
        }

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Generated ${fullPath}`);
    });
};

generateRoutes();

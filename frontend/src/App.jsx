import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import TrackingInjector from './components/TrackingInjector';
import ScrollToTop from './components/ScrollToTop';
import SideCart from './components/SideCart';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import SearchResults from './pages/SearchResults';
import Tracker from './components/Tracker';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import ThankYou from './pages/ThankYou';
import DynamicPage from './pages/DynamicPage';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminMedia from './pages/admin/AdminMedia';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBundles from './pages/admin/AdminBundles';
import AdminBundleForm from './pages/admin/AdminBundleForm';
import AdminFraudProtection from './pages/admin/AdminFraudProtection';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminAbandonedCarts from './pages/admin/AdminAbandonedCarts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPages from './pages/admin/AdminPages';

import Maintenance from './pages/Maintenance';

const CustomerLayout = ({ children, maintenanceMode, maintenanceMessage, isAdmin }) => {
  if (maintenanceMode && !isAdmin) {
    return <Maintenance message={maintenanceMessage} />;
  }
  return (
    <>
      <Navbar />
      <div className="page-wrapper">{children}</div>
      <Footer />
      <SideCart />
    </>
  );
};

function App() {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fetchMaintenance = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/settings/general_settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.maintenanceMode) {
            setMaintenanceMode(true);
            setMaintenanceMessage(data.maintenanceMessage);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaintenance();
  }, []);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isAdmin = userInfo?.isAdmin || userInfo?.role === 'superadmin' || userInfo?.role === 'admin';

  return (
    <>
        <ScrollToTop />
        <Tracker />
        <TrackingInjector />
        {mounted && <Toaster position="top-right" />}
        <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Home /></CustomerLayout>} />
        <Route path="/shop" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Shop /></CustomerLayout>} />
        <Route path="/categories" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Categories /></CustomerLayout>} />
        <Route path="/search" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><SearchResults /></CustomerLayout>} />
        <Route path="/product/:slug" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><ProductDetails /></CustomerLayout>} />
        <Route path="/pages/:slug" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><DynamicPage /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Login /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Profile /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><Cart /></CustomerLayout>} />
        <Route path="/checkout" element={maintenanceMode && !isAdmin ? <Maintenance message={maintenanceMessage} /> : <Checkout />} />
        <Route path="/thank-you/:id" element={<CustomerLayout maintenanceMode={maintenanceMode} maintenanceMessage={maintenanceMessage} isAdmin={isAdmin}><ThankYou /></CustomerLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="abandoned-carts" element={<AdminAbandonedCarts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="bundles" element={<AdminBundles />} />
          <Route path="bundles/new" element={<AdminBundleForm />} />
          <Route path="bundles/edit/:id" element={<AdminBundleForm />} />
          <Route path="fraud-protection" element={<AdminFraudProtection />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="pages" element={<AdminPages />} />
        </Route>
      </Routes>
      {(!maintenanceMode || isAdmin) && <MobileBottomNav />}
    </>
  );
}

export default App;

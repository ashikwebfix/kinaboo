import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { requestForToken, onMessageListener, initFirebase } from '../firebase';
import toast from 'react-hot-toast';
import { Bell, LayoutDashboard, PackageSearch, Layers, Image as ImageIcon, Users, ShoppingCart, LogOut, Settings as SettingsIcon, Tag, PackagePlus, Shield, Activity, PackageX, FileText, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = userInfo.role || (userInfo.isAdmin ? 'admin' : 'customer');

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState({ Products: true, Settings: true });

  const [isTokenFound, setTokenFound] = React.useState(false);

  React.useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    initFirebase(userInfo.token).then(initialized => {
      if (initialized) {
        onMessageListener(payload => {
          toast.success(payload.notification.body, { duration: 5000, icon: '🛍️' });
        });
      }
    });
  }, []);

  const enableNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const initialized = await initFirebase(userInfo.token);
      if (!initialized) {
        toast.error('Firebase is not configured in Settings.');
        return;
      }
      const token = await requestForToken();
      if (token) {
        setTokenFound(true);
        // Send token to backend
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/fcm-token', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userInfo.token
          },
          body: JSON.stringify({ fcmToken: token })
        });
        if (res.ok) {
          toast.success('Notifications enabled successfully!');
        } else {
          toast.error('Failed to save notification settings.');
        }
      }
    } catch (error) {
      toast.error('Could not enable notifications.');
      console.error(error);
    }
  };

  const notificationBtn = (
    <button 
      onClick={enableNotifications} 
      title="Enable Push Notifications"
      style={{ background: isTokenFound ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '0.65rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', width: '100%', marginBottom: '0.75rem' }}
    >
      <Bell size={16} /> {isTokenFound ? '✓ Alerts Enabled' : 'Enable Push Alerts'}
    </button>
  );


  let navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { 
      name: 'Products', 
      icon: <PackageSearch size={20} />,
      submenu: [
        { name: 'Product List', path: '/admin/products' },
        { name: 'Categories', path: '/admin/categories' }
      ]
    },
    { name: 'Bundles', path: '/admin/bundles', icon: <PackagePlus size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <Activity size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Abandoned Carts', path: '/admin/abandoned-carts', icon: <PackageX size={20} /> },
    { name: 'Pages', path: '/admin/pages', icon: <FileText size={20} /> },
    { name: 'Media Library', path: '/admin/media', icon: <ImageIcon size={20} /> },
    { 
      name: 'Settings', 
      icon: <SettingsIcon size={20} />,
      submenu: [
        { name: 'Storefront UI', path: '/admin/settings?tab=storefront' },
        { name: 'Delivery Methods', path: '/admin/settings?tab=delivery' },
        { name: 'Navigation Menu', path: '/admin/settings?tab=navigation' },
        { name: 'Marketing & Tracking', path: '/admin/settings?tab=tracking' }
      ]
    },
    { name: 'Fraud Protection', path: '/admin/fraud-protection', icon: <Shield size={20} /> },
  ];

  if (role === 'manager') {
    navItems = navItems.filter(item => ['Orders', 'Products', 'Bundles', 'Coupons', 'Media Library', 'Abandoned Carts', 'Pages'].includes(item.name));
  }

  if (role === 'superadmin' || role === 'admin') {
    navItems.splice(navItems.length - 1, 0, { name: 'Staff & Roles', path: '/admin/users', icon: <Users size={20} /> });
  }

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!mounted) return null;


  return (
    <div className="admin-layout">
      {/* Mobile Header (visible only on mobile) */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.svg" alt="Kinaboo" style={{ height: '24px' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="hide-on-desktop">{notificationBtn}</div>
          <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
          <Menu size={24} />
        </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ background: 'var(--bg-secondary)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="heading-lg" style={{ color: 'var(--text-primary)', margin: 0 }}>Admin Panel</h2>
          <button className="mobile-close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'block' }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <>
                  <button 
                    onClick={() => toggleMenu(item.name)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '8px',
                      color: 'var(--text-primary)', background: 'transparent', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.icon} {item.name}
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>{openMenus[item.name] ? '▼' : '▶'}</span>
                  </button>
                  {openMenus[item.name] && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                      {item.submenu.map(subItem => {
                        const isActive = subItem.path.includes('?') 
                          ? location.pathname + location.search === subItem.path
                          : location.pathname.startsWith(subItem.path);
                        return (
                          <Link 
                            key={subItem.path}
                            to={subItem.path}
                            style={{
                              display: 'block', padding: '0.5rem 0.75rem', borderRadius: '6px',
                              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              background: isActive ? 'rgba(6, 78, 59, 0.05)' : 'transparent',
                              fontWeight: isActive ? 600 : 500,
                              textDecoration: 'none', fontSize: '0.95rem'
                            }}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to={item.path} 
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                    color: (item.path === '/admin' ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: (item.path === '/admin' ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'rgba(6, 78, 59, 0.05)' : 'transparent',
                    fontWeight: (item.path === '/admin' ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 600 : 500,
                    textDecoration: 'none'
                  }}
                >
                  {item.icon} {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          {notificationBtn}
          <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-content" style={{ padding: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* Admin Mobile Bottom Nav */}
            <nav className="admin-bottom-nav">
        <Link to="/admin" className={`admin-bottom-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
          <Activity size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/admin/orders" className={`admin-bottom-nav-item ${location.pathname.startsWith('/admin/orders') ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </Link>
        <Link to="/admin/abandoned-carts" className={`admin-bottom-nav-item ${location.pathname.startsWith('/admin/abandoned-carts') ? 'active' : ''}`}>
          <PackageX size={20} />
          <span>Carts</span>
        </Link>
        <Link to="/admin/customers" className={`admin-bottom-nav-item ${location.pathname.startsWith('/admin/customers') ? 'active' : ''}`}>
          <Users size={20} />
          <span>Customers</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="admin-bottom-nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={20} />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, Layers, Image as ImageIcon, Users, ShoppingCart, LogOut, Settings as SettingsIcon, Tag, PackagePlus, Shield, Activity, PackageX, FileText } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = userInfo.role || (userInfo.isAdmin ? 'admin' : 'customer');

  const [openMenus, setOpenMenus] = React.useState({ Products: true, Settings: true });

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
    navItems = navItems.filter(item => ['Dashboard', 'Orders', 'Products', 'Customers'].includes(item.name));
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
      <aside className="admin-sidebar" style={{ background: 'var(--bg-secondary)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="heading-lg" style={{ color: 'var(--text-primary)' }}>Admin Panel</h2>
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
          <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-content" style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

const fs = require('fs');
const file = 'frontend/src/components/AdminLayout.jsx';
let content = fs.readFileSync(file, 'utf8');

const navReplacement = `      <nav className="admin-bottom-nav">
        <Link to="/admin" className={\`admin-bottom-nav-item \${location.pathname === '/admin' ? 'active' : ''}\`}>
          <Activity size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/admin/orders" className={\`admin-bottom-nav-item \${location.pathname.startsWith('/admin/orders') ? 'active' : ''}\`}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </Link>
        <Link to="/admin/abandoned-carts" className={\`admin-bottom-nav-item \${location.pathname.startsWith('/admin/abandoned-carts') ? 'active' : ''}\`}>
          <PackageX size={20} />
          <span>Carts</span>
        </Link>
        <Link to="/admin/customers" className={\`admin-bottom-nav-item \${location.pathname.startsWith('/admin/customers') ? 'active' : ''}\`}>
          <Users size={20} />
          <span>Customers</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="admin-bottom-nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={20} />
          <span>Menu</span>
        </button>
      </nav>`;

content = content.replace(/<nav className="admin-bottom-nav">[\s\S]*?<\/nav>/, navReplacement);
fs.writeFileSync(file, content);
console.log('updated admin bottom nav');

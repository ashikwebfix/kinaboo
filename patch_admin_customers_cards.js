const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminCustomers.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {customers.map(c => (
          <div key={c.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.2rem' }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{c.name}</div>
                  <span style={{ 
                    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '16px', fontSize: '0.75rem', marginTop: '0.25rem',
                    background: c.isAdmin ? '#fee2e2' : '#f3f4f6',
                    color: c.isAdmin ? '#991b1b' : '#374151'
                  }}>
                    {c.isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} /> {c.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <Phone size={16} /> {c.phone || 'No phone'}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                <span>{c.address || 'No address provided'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hide-on-mobile table-responsive-wrapper" style={{ overflowX: "auto" }}>
`;

content = content.replace(/      <div className="table-responsive-wrapper" style=\{\{ overflowX: "auto" \}\}>/, replacement);
fs.writeFileSync(file, content);
console.log('AdminCustomers patched');

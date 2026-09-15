const fs = require('fs');

// PATCH PAGES
let file = 'frontend/src/pages/admin/AdminPages.jsx';
let content = fs.readFileSync(file, 'utf8');

let replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {pages.map(p => (
          <div key={p.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header">
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{p.title}</div>
              <span style={{ 
                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                background: p.isPublished ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                color: p.isPublished ? '#16a34a' : '#ca8a04'
              }}>
                {p.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Slug</span>
                <span style={{ color: 'var(--text-secondary)' }}>/{p.slug}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Updated</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button className="btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hide-on-mobile table-responsive-wrapper" style={{ overflowX: "auto" }}>
`;
content = content.replace(/      <div className="table-responsive-wrapper" style=\{\{ overflowX: "auto" \}\}>/, replacement);
fs.writeFileSync(file, content);


// PATCH USERS
file = 'frontend/src/pages/admin/AdminUsers.jsx';
content = fs.readFileSync(file, 'utf8');

replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {users.map(u => (
          <div key={u.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{u.name}</div>
                  <span style={{ 
                    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginTop: '0.25rem',
                    background: u.role === 'superadmin' ? '#fef08a' : (u.role === 'admin' ? '#dbeafe' : '#f3f4f6'),
                    color: u.role === 'superadmin' ? '#854d0e' : (u.role === 'admin' ? '#1e40af' : '#374151'),
                    fontWeight: 600
                  }}>
                    {u.role ? u.role.toUpperCase() : 'CUSTOMER'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</span>
                <span style={{ color: 'var(--text-secondary)' }}>{u.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Joined</span>
                <span>{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleEditRole(u)}>
                Change Role
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hide-on-mobile table-responsive-wrapper" style={{ overflowX: "auto" }}>
`;
content = content.replace(/      <div className="table-responsive-wrapper" style=\{\{ overflowX: "auto" \}\}>/, replacement);
fs.writeFileSync(file, content);

console.log('AdminPages and AdminUsers patched');

const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminCategories.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace form grid inline styles
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}>/g, '<div className="form-grid-2">');

const replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {categories.map(c => (
          <div key={c.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={c.image || '/placeholder.png'} 
                  alt={c.title} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{c.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>/{c.slug}</div>
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {c.subtitle || 'No subtitle'}
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleEdit(c)}>
                <Edit size={16} /> Edit
              </button>
              <button className="btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleDelete(c.id)}>
                <Trash2 size={16} /> Delete
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
console.log('AdminCategories patched');

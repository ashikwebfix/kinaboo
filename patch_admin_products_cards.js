const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminProducts.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {paginatedProducts.length > 0 ? paginatedProducts.map(product => (
          <div key={product.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                <input 
                  type="checkbox" 
                  checked={selectedProductIds.includes(product.id)} 
                  onChange={() => handleSelectProduct(product.id)}
                  style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                />
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} 
                  alt={product.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{product.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>SKU: {product.sku || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {product.comparePrice > product.sellPrice && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{product.comparePrice} BDT</span>
                  )}
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{product.sellPrice || product.price} BDT</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Stock</span>
                <span>{product.trackQuantity ? product.quantity : 'Not Tracked'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status</span>
                <span style={{ 
                  background: product.status === 'published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                  color: product.status === 'published' ? '#16a34a' : '#ca8a04',
                  padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' 
                }}>
                  {product.status || 'draft'}
                </span>
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => navigate(\`/admin/products/edit/\${product.id}\`)}>
                <Edit size={16} /> Edit
              </button>
              <button className="btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleDelete(product.id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        )) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            No products found.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hide-on-mobile" style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: "auto" }}>
`;

content = content.replace(/      <div style=\{\{ background: 'var\(--bg-secondary\)', borderRadius: '12px', border: '1px solid var\(--border-color\)', overflowX: "auto" \}\}>/, replacement);
fs.writeFileSync(file, content);
console.log('AdminProducts patched');

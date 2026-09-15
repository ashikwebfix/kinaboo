const fs = require('fs');

// PATCH COUPONS
let file = 'frontend/src/pages/admin/AdminCoupons.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}>/g, '<div className="form-grid-2">');

let replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {coupons.map(coupon => (
          <div key={coupon.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header">
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{coupon.code}</div>
              <span style={{ 
                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                background: coupon.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: coupon.isActive ? '#16a34a' : '#dc2626'
              }}>
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Discount</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{coupon.discountAmount} {coupon.discountType === 'percentage' ? '%' : 'BDT'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Min Purchase</span>
                <span>{coupon.minPurchaseAmount} BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Valid Until</span>
                <span>{new Date(coupon.validUntil).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleEdit(coupon)}>
                Edit
              </button>
              <button className="btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleDelete(coupon.id)}>
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


// PATCH BUNDLES
file = 'frontend/src/pages/admin/AdminBundles.jsx';
content = fs.readFileSync(file, 'utf8');

replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {bundles.map(bundle => (
          <div key={bundle.id} className="admin-mobile-card">
            <div className="admin-mobile-card-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={bundle.image || '/placeholder.png'} 
                  alt={bundle.title} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{bundle.title}</div>
                  <span style={{ 
                    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginTop: '0.25rem',
                    background: bundle.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: bundle.isActive ? '#16a34a' : '#dc2626'
                  }}>
                    {bundle.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{bundle.price} BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compare Price</span>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{bundle.comparePrice} BDT</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Included Products:</div>
                <div style={{ fontWeight: 500 }}>
                  {bundle.bundleProducts?.map(bp => bp.product?.name).join(', ')}
                </div>
              </div>
            </div>
            
            <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => navigate(\`/admin/bundles/edit/\${bundle.id}\`)}>
                Edit
              </button>
              <button className="btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => handleDelete(bundle.id)}>
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

console.log('AdminCoupons and AdminBundles patched');

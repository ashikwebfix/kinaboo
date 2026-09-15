const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminAbandonedCarts.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading abandoned carts...
          </div>
        ) : filteredCarts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            No abandoned carts found.
          </div>
        ) : (
          filteredCarts.map((cart) => {
            let displayStatus = cart.status.toUpperCase();
            let bg = 'rgba(239, 68, 68, 0.1)';
            let color = '#dc2626';

            if (cart.status === 'recovered') {
              bg = 'rgba(34, 197, 94, 0.1)';
              color = '#16a34a';
            } else if (cart.status === 'abandoned') {
              const minsSinceUpdate = (Date.now() - new Date(cart.updatedAt).getTime()) / (1000 * 60);
              if (minsSinceUpdate < 20) {
                displayStatus = 'PENDING ABANDONED';
                bg = 'rgba(234, 179, 8, 0.1)';
                color = '#ca8a04';
              } else {
                displayStatus = 'FULLY ABANDONED';
              }
            }

            return (
              <div key={cart.id} className="admin-mobile-card">
                <div className="admin-mobile-card-header">
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                    {cart.name || 'Anonymous'}
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: bg, color: color }}>
                    {displayStatus}
                  </span>
                </div>
                
                <div className="admin-mobile-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cart.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Value</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>$\{Number(cart.totalValue).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Updated</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} /> {new Date(cart.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>Cart Items</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cart.cartData && cart.cartData.map((item, idx) => (
                        <span key={idx} style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#334155' }}>
                          {item.name} x{item.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="admin-mobile-card-footer" style={{ gap: '0.5rem' }}>
                  <button
                    onClick={() => handleTransferClick(cart)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--accent-primary)', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    <ShoppingCart size={16} /> Transfer
                  </button>
                  <a 
                    href={\`https://wa.me/\${cart.phone.replace(/[^0-9]/g, '')}?text=Hi%20\${cart.name || ''},%20we%20noticed%20you%20left%20some%20items%20in%20your%20cart!%20Need%20any%20help?\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="glass hide-on-mobile" style={{ overflow: 'hidden' }}>
`;

content = content.replace(/      <div className="glass" style=\{\{ overflow: 'hidden' \}\}>/, replacement);
fs.writeFileSync(file, content);
console.log('AdminAbandonedCarts patched');

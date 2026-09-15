const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
      {/* MOBILE APP STYLE CARDS */}
      <div className="hide-on-desktop">
        {currentOrders.length > 0 ? currentOrders.map(order => {
          const colors = getStatusColor(order.status);
          return (
            <div key={order.id} className="admin-mobile-card">
              <div className="admin-mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '1.1rem' }}>#{order.id.slice(0,6).toUpperCase()}</span>
                </div>
                <span style={{ background: colors.bg, color: colors.text, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {order.status || 'Pending'}
                </span>
              </div>
              
              <div className="admin-mobile-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customer</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date</span>
                  <span style={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{Number(order.totalPrice).toFixed(2)} BDT</span>
                </div>
              </div>
              
              <div className="admin-mobile-card-footer">
                <button 
                  onClick={() => navigate(\`/admin/orders/\${order.id}\`)}
                  style={{ width: '100%', background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Eye size={18} /> View Order Details
                </button>
              </div>
            </div>
          );
        }) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            No orders found.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hide-on-mobile" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
`;

content = content.replace(/      <div style=\{\{ background: '#fff', borderRadius: '12px', border: '1px solid var\(--border-color\)', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba\(0,0,0,0.05\)' \}\}>/, replacement);
fs.writeFileSync(file, content);
console.log('AdminOrders patched');

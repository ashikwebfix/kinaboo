const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminOrderDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
          {/* MOBILE APP STYLE ITEM CARDS */}
          <div className="hide-on-desktop">
            {(editItemsMode ? editedItems : (order.orderItems || [])).map((item, index) => (
              <div key={item.id || index} className="admin-mobile-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {item.product?.name || 'Unknown Product'}
                    </div>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {Object.entries(item.selectedVariations).map(([k,v]) => \`\${k}: \${v}\`).join(', ')}
                      </div>
                    )}
                  </div>
                  {editItemsMode && (
                    <button onClick={() => handleRemoveItem(index)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Price</span>
                    <span style={{ fontWeight: 500 }}>{Number(item.price).toFixed(2)} BDT</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Qty</span>
                    {editItemsMode ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => handleItemQtyChange(index, -1)} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                        <span style={{ width: '20px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => handleItemQtyChange(index, 1)} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{item.qty}</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{(item.qty * Number(item.price)).toFixed(2)} BDT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="table-responsive-wrapper hide-on-mobile">
`;

content = content.replace(/          <div className="table-responsive-wrapper">/, replacement);
fs.writeFileSync(file, content);
console.log('AdminOrderDetails patched');

const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminOrderDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

const itemsTableStart = content.indexOf('{/* Items Table */}');
const totalsEnd = content.indexOf('</div>\n          </div>\n        </div>\n\n        {/* RIGHT COLUMN: STATUS & TIMELINE */}');

if (itemsTableStart === -1 || totalsEnd === -1) {
  console.log("Could not find delimiters");
  process.exit(1);
}

const replacement = `
          {/* Items Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Order Items</h3>
            <button 
              onClick={handleEditItemsToggle} 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              {editItemsMode ? <><X size={16} /> Cancel Edit</> : <><Edit size={16} /> Edit Items</>}
            </button>
          </div>

          {editItemsMode && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                  <Search size={18} color="var(--text-secondary)" />
                  <input 
                    type="text"
                    placeholder="Search products to add..."
                    value={productSearch}
                    onChange={(e) => searchProducts(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '0.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => addProductToOrder(p)}
                        style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                        </div>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{p.sellPrice || p.price} BDT</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Item Description</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total</th>
                {editItemsMode && <th style={{ padding: '1rem', textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {(editItemsMode ? editedItems : (order.orderItems || [])).map((item, index) => (
                <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                    <div style={{ fontWeight: 500 }}>{item.product?.name || 'Unknown Product'}</div>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {Object.entries(item.selectedVariations).map(([k,v]) => \`\${k}: \${v}\`).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {editItemsMode ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <button onClick={() => handleItemQtyChange(index, -1)} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                        <span style={{ width: '20px', textAlign: 'center', fontWeight: 500 }}>{item.qty}</span>
                        <button onClick={() => handleItemQtyChange(index, 1)} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                    ) : (
                      item.qty
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{Number(item.price).toFixed(2)} BDT</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 500, color: 'var(--text-primary)' }}>{(item.qty * Number(item.price)).toFixed(2)} BDT</td>
                  {editItemsMode && (
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button onClick={() => handleRemoveItem(index)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {editItemsMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={handleSaveItems} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                Save Order Items
              </button>
            </div>
          )}

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>Subtotal</span>
                <span>
                  {editItemsMode 
                    ? editedItems.reduce((acc, item) => acc + (item.qty * Number(item.price)), 0).toFixed(2)
                    : (Number(order.totalPrice) - Number(order.shippingCost) + Number(order.discount)).toFixed(2)
                  } BDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>Shipping ({order.paymentMethod})</span>
                <span>{Number(order.shippingCost).toFixed(2)} BDT</span>
              </div>
              {Number(order.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                  <span>Discount {order.couponCode ? \`(\${order.couponCode})\` : ''}</span>
                  <span>-{Number(order.discount).toFixed(2)} BDT</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '2px solid var(--border-color)', marginTop: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span>
                  {editItemsMode 
                    ? (editedItems.reduce((acc, item) => acc + (item.qty * Number(item.price)), 0) + Number(order.shippingCost) - Number(order.discount)).toFixed(2)
                    : Number(order.totalPrice).toFixed(2)
                  } BDT
                </span>
              </div>
            </div>
          </div>
`;

content = content.substring(0, itemsTableStart) + replacement + content.substring(totalsEnd);
fs.writeFileSync(file, content);
console.log('table patched');

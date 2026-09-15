const fs = require('fs');
let file = 'frontend/src/pages/admin/AdminOrderDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

const mobileLayout = `
      {/* --- MOBILE APP LAYOUT --- */}
      <div className="hide-on-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
        
        {/* Mobile Header Card */}
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Order #{order.id.slice(0,6).toUpperCase()}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <span style={{ background: currentColors.bg, color: currentColors.text, padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            {order.status}
          </span>
        </div>

        {/* Customer & Shipping Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Customer</h3>
            <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{order.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{order.phone}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{order.user?.email}</div>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', margin: 0 }}>Shipping To</h3>
              <button onClick={openEditShipping} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}>Edit</button>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {order.shippingAddress}<br />
              {order.city}<br />
              {order.postalCode && \`Postal Code: \${order.postalCode}\`}
            </div>
          </div>
        </div>

        {/* Items Card */}
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Items Ordered</h3>
            <button 
              onClick={handleEditItemsToggle} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
            >
              {editItemsMode ? <><X size={14} /> Cancel</> : <><Edit size={14} /> Edit</>}
            </button>
          </div>

          {editItemsMode && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => searchProducts(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
              {searchResults.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '0.25rem', maxHeight: '150px', overflowY: 'auto' }}>
                  {searchResults.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => addProductToOrder(p)}
                      style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
                      <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{p.sellPrice || p.price} BDT</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(editItemsMode ? editedItems : (order.orderItems || [])).map((item, index) => (
              <div key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product?.name || 'Unknown Product'}</div>
                {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {Object.entries(item.selectedVariations).map(([k,v]) => \`\${k}: \${v}\`).join(', ')}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {editItemsMode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleItemQtyChange(index, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: '#f1f5f9' }}>-</button>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.qty}</span>
                      <button onClick={() => handleItemQtyChange(index, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: '#f1f5f9' }}>+</button>
                      <button onClick={() => handleRemoveItem(index)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#ef4444', marginLeft: '0.5rem' }}><Trash2 size={12} /></button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.qty} × {Number(item.price).toFixed(2)}</span>
                  )}
                  <span style={{ fontWeight: 600 }}>{(item.qty * Number(item.price)).toFixed(2)} BDT</span>
                </div>
              </div>
            ))}
          </div>
          {editItemsMode && (
            <button onClick={handleSaveItems} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Items</button>
          )}
        </div>

        {/* Totals Summary */}
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Payment Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span>
              {editItemsMode 
                ? editedItems.reduce((acc, item) => acc + (item.qty * Number(item.price)), 0).toFixed(2)
                : (Number(order.totalPrice) - Number(order.shippingCost) + Number(order.discount)).toFixed(2)
              } BDT
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>Shipping</span>
            <span>{Number(order.shippingCost).toFixed(2)} BDT</span>
          </div>
          {Number(order.discount) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
              <span>Discount</span>
              <span>-{Number(order.discount).toFixed(2)} BDT</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '2px dashed var(--border-color)', fontWeight: 800, fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>
              {editItemsMode 
                ? (editedItems.reduce((acc, item) => acc + (item.qty * Number(item.price)), 0) + Number(order.shippingCost) - Number(order.discount)).toFixed(2)
                : Number(order.totalPrice).toFixed(2)
              } BDT
            </span>
          </div>
        </div>

        {/* Update Order Status */}
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Update Status</h3>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Status</label>
              <select className="input-field" value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%' }}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Courier</label>
              <input type="text" className="input-field" value={courierName} onChange={e => setCourierName(e.target.value)} placeholder="e.g. Pathao" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Tracking #</label>
              <input type="text" className="input-field" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Tracking ID" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Note</label>
              <textarea className="input-field" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." style={{ width: '100%', minHeight: '60px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Order</button>
          </form>
        </div>

        {/* Timeline */}
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Timeline</h3>
          <div style={{ position: 'relative', paddingLeft: '1rem' }}>
            <div style={{ position: 'absolute', left: '0', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }}></div>
            {logs.length > 0 ? logs.map((log, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: index === logs.length - 1 ? '0' : '1.5rem' }}>
                <div style={{ position: 'absolute', left: '-1rem', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', border: '2px solid #fff', transform: 'translateX(-50%)' }}></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(log.date).toLocaleString()}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0' }}>Status: {log.status}</div>
                {log.note && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.note}</div>}
              </div>
            )) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No timeline events.</div>
            )}
          </div>
        </div>
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className="admin-order-grid hide-on-mobile">
`;

content = content.replace(/      <div className="admin-order-grid">/, mobileLayout);
fs.writeFileSync(file, content);
console.log('AdminOrderDetails mobile layout patched');

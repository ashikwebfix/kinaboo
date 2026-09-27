import React, { useState, useEffect } from 'react';
import { PackageX, MessageCircle, Clock, Search, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminAbandonedCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Transfer Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [transferData, setTransferData] = useState({
    name: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
    shippingCost: 0,
    discount: 0,
    couponCode: ''
  });
  const [transferring, setTransferring] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo.token) { navigate('/login'); return; }
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      if (res.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setCarts(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to load abandoned carts');
      }
    } catch (error) {
      toast.error('Server error loading carts');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferClick = (cart) => {
    setSelectedCart(cart);
    setTransferData({
      name: cart.name || '',
      shippingAddress: '',
      city: '',
      postalCode: '',
      paymentMethod: 'Cash on Delivery',
      shippingCost: 0,
      discount: 0,
      couponCode: ''
    });
    setShowModal(true);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    if (!selectedCart) return;

    setTransferring(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/abandoned-carts/${selectedCart.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(transferData)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success('Successfully transferred to order!');
        setShowModal(false);
        setSelectedCart(null);
        fetchCarts(); // refresh
      } else {
        toast.error(data.message || 'Transfer failed');
      }
    } catch (error) {
      toast.error('Server error during transfer');
    } finally {
      setTransferring(false);
    }
  };

  const filteredCarts = carts.filter(c => 
    c.phone.includes(searchTerm) || 
    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackageX size={24} color="var(--accent-primary)" />
            Abandoned Carts
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Recover lost sales by contacting customers who left without buying.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search phone or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', minWidth: '300px' }}
            />
          </div>
        </div>
      </div>


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
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>${Number(cart.totalValue).toFixed(2)}</span>
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
                    href={`https://wa.me/${cart.phone.replace(/[^0-9]/g, '')}?text=Hi%20${cart.name || ''},%20we%20noticed%20you%20left%20some%20items%20in%20your%20cart!%20Need%20any%20help?`}
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

        <div className="table-responsive-wrapper">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Cart Items</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Value</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Last Updated</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading carts...</td>
              </tr>
            ) : filteredCarts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No abandoned carts found.</td>
              </tr>
            ) : (
              filteredCarts.map((cart) => (
                <tr key={cart.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cart.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{cart.phone}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cart.cartData && cart.cartData.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.875rem', background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {item.name} x{item.qty}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    ${Number(cart.totalValue).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} />
                      {new Date(cart.updatedAt).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {(() => {
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
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: bg,
                          color: color
                        }}>
                          {displayStatus}
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleTransferClick(cart)}
                        title="Transfer to Order"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          background: 'var(--accent-primary)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}
                      >
                        <ShoppingCart size={16} />
                        Transfer
                      </button>
                      <a 
                        href={`https://wa.me/${cart.phone.replace(/[^0-9]/g, '')}?text=Hi%20${cart.name || ''},%20we%20noticed%20you%20left%20some%20items%20in%20your%20cart!%20Need%20any%20help?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          background: '#25D366',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && selectedCart && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass" style={{
            background: '#fff',
            width: '100%', maxWidth: '500px',
            padding: '2rem', borderRadius: '12px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Transfer to Order
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Convert <strong>{selectedCart.phone}</strong>'s abandoned cart into an actual order.
            </p>

            <form onSubmit={submitTransfer} style={{ display: 'grid', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>Name *</label>
                <input 
                  required
                  type="text"
                  className="input-field" 
                  value={transferData.name}
                  onChange={e => setTransferData({...transferData, name: e.target.value})}
                  style={{ background: '#f9fafb', color: '#111827', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>Shipping Address *</label>
                <textarea 
                  required
                  className="input-field" 
                  value={transferData.shippingAddress}
                  onChange={e => setTransferData({...transferData, shippingAddress: e.target.value})}
                  rows="2"
                  style={{ background: '#f9fafb', color: '#111827', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>City *</label>
                  <input 
                    required
                    type="text"
                    className="input-field" 
                    value={transferData.city}
                    onChange={e => setTransferData({...transferData, city: e.target.value})}
                    style={{ background: '#f9fafb', color: '#111827', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>Payment Method *</label>
                  <select 
                    className="input-field"
                    value={transferData.paymentMethod}
                    onChange={e => setTransferData({...transferData, paymentMethod: e.target.value})}
                    style={{ background: '#f9fafb', color: '#111827', border: '1px solid #d1d5db' }}
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn"
                  style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={transferring}
                >
                  {transferring ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAbandonedCarts;

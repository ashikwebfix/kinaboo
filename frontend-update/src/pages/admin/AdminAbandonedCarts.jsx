import React, { useState, useEffect } from 'react';
import { PackageX, MessageCircle, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAbandonedCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCarts(data);
      } else {
        toast.error('Failed to load abandoned carts');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setLoading(false);
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

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    <a 
                      href={`https://wa.me/${cart.phone.replace(/[^0-9]/g, '')}?text=Hi%20${cart.name || ''},%20we%20noticed%20you%20left%20some%20items%20in%20your%20cart!%20Need%20any%20help?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAbandonedCarts;

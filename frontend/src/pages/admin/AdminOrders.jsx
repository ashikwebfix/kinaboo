import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, Search } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/admin/login');
    fetchOrders();
  }, [navigate, token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'Processing': return { bg: '#e0e7ff', text: '#3730a3' };
      case 'Shipped': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered': return { bg: '#d1fae5', text: '#065f46' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone.includes(searchQuery)
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading orders...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Package size={28} /> Order Management
        </h1>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by ID, Name, or Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: '2.5rem', background: '#fff' }}
          />
        </div>
      </header>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map(order => {
              const colors = getStatusColor(order.status);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', ':hover': { background: '#f8fafc' } }}>
                  <td style={{ padding: '1.25rem 1rem', fontFamily: 'monospace', fontWeight: 500 }}>#{order.id.slice(0,6).toUpperCase()}</td>
                  <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 500 }}>{order.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.phone}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{Number(order.totalPrice).toFixed(2)} BDT</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ background: colors.bg, color: colors.text, padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Eye size={16} /> Details
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

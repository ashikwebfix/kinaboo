import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/bundles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBundles(data);
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bundle?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bundles/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchBundles();
        }
      } catch (error) {
        console.error("Error deleting bundle:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={24} /> Product Bundles
        </h1>
        <Link to="/admin/bundles/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Bundle
        </Link>
      </header>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Bundle Name</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Discount</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map(bundle => (
              <tr key={bundle.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{bundle.name}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: 500,
                    background: bundle.type === 'combo' ? '#e0e7ff' : '#fce7f3',
                    color: bundle.type === 'combo' ? '#4338ca' : '#be185d',
                    textTransform: 'capitalize'
                  }}>
                    {bundle.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {bundle.discountValue}{bundle.discountType === 'percentage' ? '%' : ' BDT'} off
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: 500,
                    background: bundle.isActive ? '#dcfce7' : '#fee2e2',
                    color: bundle.isActive ? '#166534' : '#b91c1c'
                  }}>
                    {bundle.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <Link to={`/admin/bundles/edit/${bundle.id}`} className="btn" style={{ padding: '0.5rem' }}>
                      <Edit size={16} />
                    </Link>
                    <button className="btn" onClick={() => handleDelete(bundle.id)} style={{ padding: '0.5rem', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {bundles.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>No bundles found. Create one to increase sales!</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBundles;

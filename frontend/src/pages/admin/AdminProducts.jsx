import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchProducts();
  }, [navigate, token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/products/bulk`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ ids: selectedProductIds })
        });
        setSelectedProductIds([]);
        fetchProducts();
      } catch (error) {
        console.error("Error bulk deleting:", error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (window.confirm(`Are you sure you want to mark ${selectedProductIds.length} products as ${status}?`)) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/products/bulk/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ ids: selectedProductIds, status })
        });
        setSelectedProductIds([]);
        fetchProducts();
      } catch (error) {
        console.error("Error bulk updating status:", error);
      }
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg">Products Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/products/new')}>
          <Plus size={18} /> Add Product
        </button>
      </header>

      {selectedProductIds.length > 0 && (
        <div style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid var(--accent-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{selectedProductIds.length} items selected</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: '#fff' }} onClick={() => handleBulkStatusUpdate('published')}>Publish Selected</button>
            <button className="btn" style={{ background: '#fff' }} onClick={() => handleBulkStatusUpdate('draft')}>Unpublish Selected</button>
            <button className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={handleBulkDelete}>Delete Selected</button>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={paginatedProducts.length > 0 && selectedProductIds.length === paginatedProducts.length} 
                  onChange={handleSelectAll} 
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedProductIds.includes(p.id)} 
                    onChange={() => handleSelectProduct(p.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={p.image || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  <span style={{ fontWeight: '500' }}>{p.name}</span>
                </td>
                <td style={{ padding: '1rem' }}>{Number(p.price).toFixed(2)} BDT</td>
                <td style={{ padding: '1rem' }}>{p.category}</td>
                <td style={{ padding: '1rem' }}>{p.stock}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '16px', fontSize: '0.85rem', 
                    background: p.status === 'published' ? '#d1fae5' : '#fef3c7',
                    color: p.status === 'published' ? '#065f46' : '#92400e'
                  }}>
                    {p.status || 'published'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn" onClick={() => navigate(`/admin/products/edit/${p.id}`)} style={{ padding: '0.5rem', marginRight: '0.5rem' }} title="Edit"><Edit size={16} /></button>
                  <a href={`/product/${p.slug || p.id}`} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.5rem', marginRight: '0.5rem', display: 'inline-flex', color: 'var(--text-secondary)' }} title="View on Store"><Eye size={16} /></a>
                  <button className="btn" onClick={() => handleDelete(p.id)} style={{ padding: '0.5rem', color: '#ef4444' }} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="text-muted">Items per page:</span>
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.25rem 0.5rem', minHeight: 'auto' }} 
            value={itemsPerPage} 
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="text-muted">Page {currentPage} of {totalPages || 1}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '0.5rem' }}><ChevronLeft size={16}/></button>
            <button className="btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '0.5rem' }}><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

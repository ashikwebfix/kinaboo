import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Power, PowerOff, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MultiSelectModal from '../../components/MultiSelectModal';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [applicableProducts, setApplicableProducts] = useState([]);
  const [applicableCategories, setApplicableCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [applicableCustomers, setApplicableCustomers] = useState('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchCoupons();
    fetchProducts();
    fetchCategories();
  }, [navigate, token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products');
      const data = await res.json();
      if (res.ok) setAllProducts(data.products || data || []);
    } catch (e) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/categories');
      const data = await res.json();
      if (res.ok) setAllCategories(data);
    } catch (e) {}
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCoupons(data);
      } else {
        console.error("Error fetching coupons:", data.message);
        if (res.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/admin/login');
        }
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCode || !discountValue) return;

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/coupons', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          code: newCode.toUpperCase(), 
          discountType, 
          discountValue: Number(discountValue),
          startDate: startDate || null,
          endDate: endDate || null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          minPurchaseAmount: minPurchaseAmount ? Number(minPurchaseAmount) : 0,
          applicableProducts: applicableProducts,
          applicableCategories: applicableCategories,
          applicableCustomers: applicableCustomers ? applicableCustomers.split(',').map(s => s.trim()) : []
        })
      });
      if (res.ok) {
        setNewCode('');
        setDiscountValue('');
        setStartDate('');
        setEndDate('');
        setUsageLimit('');
        setMinPurchaseAmount('');
        setApplicableProducts([]);
        setApplicableCategories([]);
        setApplicableCustomers('');
        setShowForm(false);
        fetchCoupons();
      } else {
        const err = await res.json();
        alert(err.message || 'Error creating coupon');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={24} /> Advanced Coupons
          </h1>
          <p className="text-muted">Create and manage conditional promotional codes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus size={18} /> Create New Coupon</>}
        </button>
      </header>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Coupon Configuration
          </h2>
          <form onSubmit={handleAddCoupon}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Coupon Code *</label>
                <input required className="input-field" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. SUMMER20" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Discount Type *</label>
                  <select className="input-field" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (BDT)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Value *</label>
                  <input required type="number" min="1" className="input-field" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="20" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Valid From</label>
                <input type="datetime-local" className="input-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Valid Until</label>
                <input type="datetime-local" className="input-field" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Max Usages (Total)</label>
                <input type="number" min="1" className="input-field" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Leave blank for unlimited" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Minimum Purchase Amount (BDT)</label>
                <input type="number" min="0" className="input-field" value={minPurchaseAmount} onChange={(e) => setMinPurchaseAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Allowed Customer Emails (comma separated)</label>
                <input type="text" className="input-field" value={applicableCustomers} onChange={(e) => setApplicableCustomers(e.target.value)} placeholder="e.g. vip@example.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Allowed Products</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(true)} style={{ justifyContent: 'center' }}>
                    Select Products ({applicableProducts.length})
                  </button>
                  {applicableProducts.length === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Applies to all products</div>}
                  {applicableProducts.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                      {applicableProducts.map(id => {
                        const p = allProducts.find(x => x.id === id);
                        return <span key={id} style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>{p ? p.name : id}</span>
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Allowed Categories</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsCategoryModalOpen(true)} style={{ justifyContent: 'center' }}>
                    Select Categories ({applicableCategories.length})
                  </button>
                  {applicableCategories.length === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Applies to all categories</div>}
                  {applicableCategories.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                      {applicableCategories.map(name => {
                        return <span key={name} style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>{name}</span>
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Save Coupon
            </button>
          </form>
        </div>
      )}

      <MultiSelectModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={setApplicableProducts} 
        items={allProducts} 
        selectedItems={applicableProducts} 
        title="Select Allowed Products" 
        itemKey="id" 
        itemLabel="name" 
        itemImage="images"
        itemSubtitle="sku"
      />

      <MultiSelectModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onSave={setApplicableCategories} 
        items={allCategories} 
        selectedItems={applicableCategories} 
        title="Select Allowed Categories" 
        itemKey="title" 
        itemLabel="title" 
      />

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Code</th>
              <th style={{ padding: '1rem' }}>Discount</th>
              <th style={{ padding: '1rem' }}>Usage</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {coupon.code}
                  {(coupon.minPurchaseAmount > 0 || coupon.usageLimit || coupon.applicableCustomers || coupon.startDate) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Has conditions</div>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue || coupon.discountPercentage}% OFF` 
                    : `${coupon.discountValue} BDT OFF`}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {coupon.usedCount} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: 500,
                    background: coupon.isActive ? '#dcfce7' : '#fef08a',
                    color: coupon.isActive ? '#166534' : '#854d0e'
                  }}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleToggle(coupon.id)}
                      className="btn" 
                      style={{ padding: '0.5rem', background: coupon.isActive ? '#fee2e2' : '#dcfce7', color: coupon.isActive ? '#ef4444' : '#22c55e', borderColor: 'transparent' }}
                      title={coupon.isActive ? "Deactivate" : "Activate"}
                    >
                      {coupon.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="btn" 
                      style={{ padding: '0.5rem', color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No coupons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminCoupons;

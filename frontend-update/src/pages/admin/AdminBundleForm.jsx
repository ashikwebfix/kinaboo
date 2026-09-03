import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBundleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  const [formData, setFormData] = useState({
    name: '',
    type: 'combo',
    mainProductId: '',
    products: [],
    volumeTiers: [{ qty: 2, discount: 10 }],
    discountType: 'percentage',
    discountValue: 0,
    isActive: true
  });

  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null); // 'main' or 'bundle'

  useEffect(() => {
    fetchProducts();
    if (isEdit) {
      fetchBundle();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products');
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBundle = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bundles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name,
          type: data.type,
          mainProductId: data.mainProductId || '',
          products: data.products || [],
          volumeTiers: data.volumeTiers || [{ qty: 2, discount: 10 }],
          discountType: data.discountType,
          discountValue: data.discountValue,
          isActive: data.isActive
        });
      }
    } catch (error) {
      console.error("Error fetching bundle:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `${import.meta.env.VITE_API_URL}/api/bundles/${id}` : import.meta.env.VITE_API_URL + '/api/bundles';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(isEdit ? 'Bundle updated' : 'Bundle created');
        navigate('/admin/bundles');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Error saving bundle');
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error('An error occurred');
    }
  };

  const getMainProduct = () => allProducts.find(p => p.id === formData.mainProductId);
  const getBundleProducts = () => allProducts.filter(p => formData.products.includes(p.id));
  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  const handleSelectProduct = (product) => {
    if (selectingFor === 'main') {
      setFormData({ ...formData, mainProductId: product.id });
      setShowProductModal(false);
    } else if (selectingFor === 'bundle') {
      if (!formData.products.includes(product.id)) {
        setFormData({ ...formData, products: [...formData.products, product.id] });
      }
      // Keep modal open for multiple selections
    }
  };

  const handleRemoveBundleProduct = (productId) => {
    setFormData({ ...formData, products: formData.products.filter(id => id !== productId) });
  };

  const handleAddTier = () => {
    setFormData({
      ...formData,
      volumeTiers: [...formData.volumeTiers, { qty: formData.volumeTiers.length + 2, discount: 15 }]
    });
  };

  const handleUpdateTier = (index, field, value) => {
    const newTiers = [...formData.volumeTiers];
    newTiers[index][field] = Number(value);
    setFormData({ ...formData, volumeTiers: newTiers });
  };

  const handleRemoveTier = (index) => {
    const newTiers = [...formData.volumeTiers];
    newTiers.splice(index, 1);
    setFormData({ ...formData, volumeTiers: newTiers });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/bundles')} className="btn-icon">
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading-lg">{isEdit ? 'Edit Bundle' : 'Create Bundle'}</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Basic Info */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Basic Information</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label className="form-label">Internal Bundle Name</label>
                  <input 
                    required 
                    className="input-field" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Summer Skincare Combo"
                  />
                </div>

                <div>
                  <label className="form-label">Bundle Type</label>
                  <select 
                    className="input-field" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ background: '#fff' }}
                  >
                    <option value="combo">Frequently Bought Together (Combo)</option>
                    <option value="volume">Volume Discount (Quantity Breaks)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Section based on Type */}
            {formData.type === 'combo' && (
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Combo Products</h2>
                  <button type="button" className="btn btn-secondary" onClick={() => { setSelectingFor('bundle'); setShowProductModal(true); }}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                
                {formData.products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)' }}>
                    Select products to bundle with the main product.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {getBundleProducts().map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={p.image || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{p.name}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveBundleProduct(p.id)} className="btn-icon" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <label className="form-label">Combo Discount Type</label>
                    <select 
                      className="input-field" 
                      value={formData.discountType} 
                      onChange={e => setFormData({...formData, discountType: e.target.value})}
                      style={{ background: '#fff' }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (BDT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Discount Value</label>
                    <input 
                      type="number" 
                      required 
                      className="input-field" 
                      value={formData.discountValue} 
                      onChange={e => setFormData({...formData, discountValue: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'volume' && (
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Quantity Break Tiers</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Set discounts for buying multiple quantities of the main product.</p>
                
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                  {formData.volumeTiers.map((tier, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Quantity</label>
                        <input type="number" min="2" className="input-field" value={tier.qty} onChange={e => handleUpdateTier(index, 'qty', e.target.value)} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Discount (%)</label>
                        <input type="number" min="0" max="100" className="input-field" value={tier.discount} onChange={e => handleUpdateTier(index, 'discount', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => handleRemoveTier(index)} className="btn btn-secondary" style={{ height: '42px', padding: '0 1rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button type="button" className="btn btn-secondary" onClick={handleAddTier}>
                  <Plus size={16} /> Add Tier
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Publishing</h2>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 500, marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input 
                  type="checkbox" 
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                />
                Active Status
              </label>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
                <Save size={18} /> Save Bundle
              </button>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Display Location</h2>
              <label className="form-label">Main Product Page</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>This bundle will be displayed on the selected product's page.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#f8fafc' }}>
                  {formData.mainProductId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={getMainProduct()?.image || 'https://placehold.co/400x400?text=No+Image'} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{getMainProduct()?.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No product selected</span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setSelectingFor('main'); setShowProductModal(true); }}
                >
                  {formData.mainProductId ? 'Change Product' : 'Select Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '12px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Select Product</h3>
              <button onClick={() => setShowProductModal(false)} className="btn-icon"><X size={20} /></button>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }} 
                  placeholder="Search products..." 
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
              {filteredProducts.map(product => {
                const isSelected = selectingFor === 'bundle' && formData.products.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', 
                      borderRadius: '8px', cursor: 'pointer',
                      background: isSelected ? '#f0fdf4' : 'transparent',
                      border: isSelected ? '1px solid #bbf7d0' : '1px solid transparent',
                      marginBottom: '0.5rem'
                    }}
                    className="hover-bg"
                  >
                    <img src={product.image || 'https://placehold.co/400x400?text=No+Image'} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>${product.sellPrice || product.price}</div>
                    </div>
                    {isSelected && <div style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>Added</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBundleForm;

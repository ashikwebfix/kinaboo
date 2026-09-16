import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, MapPin, User, FileText, CheckCircle, Clock, Package, X, Send, Edit, Trash2, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = userInfo.token;
  const userRole = userInfo.role;

  // Form states
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [note, setNote] = useState('');

  // Pathao Modal states
  const [showPathaoModal, setShowPathaoModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [weight, setWeight] = useState(0.5);
  const [itemType, setItemType] = useState(2); // 2 = Parcel
  const [pathaoLoading, setPathaoLoading] = useState(false);
  
  const [isManualPathao, setIsManualPathao] = useState(false);
  const [showEditShipping, setShowEditShipping] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: '', phone: '', shippingAddress: '', city: '', postalCode: ''
  });

  // Order Items Edit State
  const [editItemsMode, setEditItemsMode] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    if (!token) navigate('/admin/login');
    fetchOrder();
  }, [id, token, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const foundOrder = data.find(o => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
        setEditedItems(foundOrder.orderItems || []);
        setStatus(foundOrder.status || 'Pending');
        setTrackingNumber(foundOrder.trackingNumber || '');
        setCourierName(foundOrder.courierName || '');
      } else {
        toast.error('Order not found');
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditShipping = () => {
    setShippingData({
      name: order.name || '',
      phone: order.phone || '',
      shippingAddress: order.shippingAddress || '',
      city: order.city || '',
      postalCode: order.postalCode || ''
    });
    setShowEditShipping(true);
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(shippingData)
      });
      if (res.ok) {
        toast.success('Shipping information updated');
        setShowEditShipping(false);
        fetchOrder();
      } else {
        toast.error('Failed to update shipping info');
      }
    } catch (error) {
      toast.error('Error updating shipping');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          status, 
          trackingNumber, 
          courierName, 
          note 
        })
      });
      
      if (res.ok) {
        toast.success('Order updated successfully!');
        setNote(''); // clear note field
        fetchOrder(); // refresh data
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update order');
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error('Something went wrong');
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this order and all its details? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Order deleted successfully');
        navigate('/admin/orders');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete order');
      }
    } catch (error) {
      toast.error('Error deleting order');
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); 
  };

  const openPathaoModal = async () => {
    setShowPathaoModal(true);
    setPathaoLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/pathao/cities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      } else {
        toast.error('Failed to load Pathao cities. Check API settings.');
      }
    } catch (error) {
      toast.error('Error connecting to Pathao API.');
    } finally {
      setPathaoLoading(false);
    }
  };


  const handleEditItemsToggle = () => {
    if (editItemsMode) {
      // cancel
      setEditedItems(order.orderItems || []);
      setEditItemsMode(false);
    } else {
      setEditedItems(order.orderItems || []);
      setEditItemsMode(true);
    }
  };

  const handleItemQtyChange = (index, delta) => {
    const newItems = [...editedItems];
    if (newItems[index].qty + delta > 0) {
      newItems[index].qty += delta;
      setEditedItems(newItems);
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...editedItems];
    newItems.splice(index, 1);
    setEditedItems(newItems);
  };

  const searchProducts = async (q) => {
    setProductSearch(q);
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${q}`);
      const data = await res.json();
      setSearchResults(data.products || data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const addProductToOrder = (product) => {
    // Check if already in order
    const existingIndex = editedItems.findIndex(i => i.productId === product.id);
    if (existingIndex >= 0) {
      handleItemQtyChange(existingIndex, 1);
    } else {
      setEditedItems([...editedItems, {
        productId: product.id,
        product: product,
        qty: 1,
        price: product.sellPrice || product.price,
        selectedVariations: null // default variations
      }]);
    }
    setProductSearch('');
    setSearchResults([]);
  };

  const handleSaveItems = async () => {
    if (editedItems.length === 0) {
      return toast.error('Order must have at least one item');
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/items`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ orderItems: editedItems })
      });
      if (res.ok) {
        toast.success('Order items updated successfully!');
        setEditItemsMode(false);
        fetchOrder();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update items');
      }
    } catch (error) {
      toast.error('Error saving items');
    }
  };

  useEffect(() => {
    if (selectedCity) {
      setZones([]);
      setAreas([]);
      setSelectedZone('');
      setSelectedArea('');
      fetch(`${import.meta.env.VITE_API_URL}/api/pathao/zones/${selectedCity}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(() => toast.error('Failed to load zones'));
    }
  }, [selectedCity, token]);

  useEffect(() => {
    if (selectedZone) {
      setAreas([]);
      setSelectedArea('');
      fetch(`${import.meta.env.VITE_API_URL}/api/pathao/areas/${selectedZone}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setAreas(data))
      .catch(() => toast.error('Failed to load areas'));
    }
  }, [selectedZone, token]);

  const handleDispatchPathao = async () => {
    if (!selectedCity || !selectedZone || !selectedArea) {
      return toast.error('Please select City, Zone, and Area');
    }
    setPathaoLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pathao/create-order/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          city_id: selectedCity,
          zone_id: selectedZone,
          area_id: selectedArea,
          weight: parseFloat(weight),
          item_type: parseInt(itemType)
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Dispatched! Consignment ID: ${data.consignment_id}`);
        setShowPathaoModal(false);
        fetchOrder();
      } else {
        toast.error(data.message || 'Failed to dispatch to Pathao');
      }
    } catch (error) {
      toast.error('Error dispatching to Pathao API');
    } finally {
      setPathaoLoading(false);
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'Pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'Processing': return { bg: '#e0e7ff', text: '#3730a3' };
      case 'Shipped': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered': return { bg: '#d1fae5', text: '#065f46' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading order details...</div>;
  if (!order) return null;

  const currentColors = getStatusColor(order.status);

  let logs = [];
  if (Array.isArray(order.statusLogs)) {
    logs = order.statusLogs;
  } else if (typeof order.statusLogs === 'string') {
    try { logs = JSON.parse(order.statusLogs); } catch(e) {}
  }
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* Edit Shipping Modal */}
      {showEditShipping && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Edit Shipping Details</h2>
              <button onClick={() => setShowEditShipping(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdateShipping} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Customer Name</label>
                <input className="input-field" value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} style={{ width: '100%' }} required />
              </div>
              <div>
                <label className="input-label">Phone</label>
                <input className="input-field" value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} style={{ width: '100%' }} required />
              </div>
              <div>
                <label className="input-label">Address</label>
                <textarea className="input-field" value={shippingData.shippingAddress} onChange={e => setShippingData({...shippingData, shippingAddress: e.target.value})} style={{ width: '100%', resize: 'vertical' }} required />
              </div>
              <div>
                <label className="input-label">City / Area</label>
                <input className="input-field" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="input-label">Postal Code</label>
                <input className="input-field" value={shippingData.postalCode} onChange={e => setShippingData({...shippingData, postalCode: e.target.value})} style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Pathao Modal */}
      {showPathaoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48' }}>
                <Send size={20} /> Dispatch via Pathao
              </h2>
              <button onClick={() => setShowPathaoModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Select the precise delivery destination.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
                <input type="checkbox" checked={isManualPathao} onChange={e => setIsManualPathao(e.target.checked)} style={{ cursor: 'pointer' }} />
                Manual ID Entry
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isManualPathao ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>City ID</label>
                    <input type="number" className="input-field" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ width: '100%' }} placeholder="e.g. 1" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Zone ID</label>
                    <input type="number" className="input-field" value={selectedZone} onChange={e => setSelectedZone(e.target.value)} style={{ width: '100%' }} placeholder="e.g. 1" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Area ID</label>
                    <input type="number" className="input-field" value={selectedArea} onChange={e => setSelectedArea(e.target.value)} style={{ width: '100%' }} placeholder="e.g. 1" />
                  </div>
                </>
              ) : (
                <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>City</label>
                <select className="input-field" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={pathaoLoading || cities.length === 0} style={{ width: '100%' }}>
                  <option value="">Select City...</option>
                  {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Zone</label>
                <select className="input-field" value={selectedZone} onChange={e => setSelectedZone(e.target.value)} disabled={!selectedCity || zones.length === 0} style={{ width: '100%' }}>
                  <option value="">Select Zone...</option>
                  {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Area</label>
                <select className="input-field" value={selectedArea} onChange={e => setSelectedArea(e.target.value)} disabled={!selectedZone || areas.length === 0} style={{ width: '100%' }}>
                  <option value="">Select Area...</option>
                  {areas.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                </select>
              </div>
              </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Weight (kg)</label>
                  <input type="number" step="0.1" className="input-field" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Item Type</label>
                  <select className="input-field" value={itemType} onChange={e => setItemType(e.target.value)} style={{ width: '100%' }}>
                    <option value="2">Parcel</option>
                    <option value="1">Document</option>
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleDispatchPathao} 
                disabled={pathaoLoading}
                style={{ width: '100%', marginTop: '1rem', background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {pathaoLoading ? 'Processing...' : <><Truck size={18} /> Create Consignment</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/admin/orders')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
        >
          <ArrowLeft size={18} /> Back to Orders
        </button>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {userRole === 'superadmin' && (
            <button 
              onClick={handleDeleteOrder}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#dc2626', borderColor: '#fee2e2' }}
            >
              <Trash2 size={18} /> Delete Order
            </button>
          )}
          <button 
            onClick={openPathaoModal}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#e11d48', color: '#e11d48' }}
          >
            <Send size={18} /> Send to Pathao
          </button>
          <button 
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Printer size={18} /> Print Invoice
          </button>
        </div>
      </header>


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
              {order.postalCode && `Postal Code: ${order.postalCode}`}
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
                    {Object.entries(item.selectedVariations).map(([k,v]) => `${k}: ${v}`).join(', ')}
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

        
        {/* LEFT COLUMN: INVOICE */}
        <div ref={printRef} className="invoice-card">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>INVOICE</h1>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Order #{order.id.slice(0,6).toUpperCase()}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <img src="/logo.svg" alt="Kinaboo" style={{ height: '32px' }} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Rd 53, Gulshan 2<br />
                Dhaka, Bangladesh<br />
                support@kinaboo.com<br />
                01354-557477
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="admin-order-info-grid">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billed To</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong>{order.name}</strong><br />
                {order.phone}<br />
                {order.user?.email}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipped To</h3>
                <button onClick={openEditShipping} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {order.shippingAddress}<br />
                {order.city}<br />
                {order.postalCode && `Postal Code: ${order.postalCode}`}
              </div>
            </div>
          </div>

          
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
                        {Object.entries(item.selectedVariations).map(([k,v]) => `${k}: ${v}`).join(', ')}
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

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem", minWidth: "600px" }}>
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
                        {Object.entries(item.selectedVariations).map(([k,v]) => `${k}: ${v}`).join(', ')}
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
          </div>

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
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
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
        </div>
        {/* RIGHT COLUMN: STATUS & TIMELINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Update Status Card */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} /> Update Order
              </h2>
              <span style={{ background: currentColors.bg, color: currentColors.text, padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                {order.status}
              </span>
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Order Status</label>
                <select className="input-field" value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', background: '#f8fafc' }}>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="input-label">Courier Name (Optional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={courierName} 
                  onChange={e => setCourierName(e.target.value)} 
                  placeholder="e.g. Pathao, Steadfast..." 
                  style={{ width: '100%' }} 
                />
              </div>

              <div>
                <label className="input-label">Tracking Number (Optional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={trackingNumber} 
                  onChange={e => setTrackingNumber(e.target.value)} 
                  placeholder="Tracking ID" 
                  style={{ width: '100%' }} 
                />
              </div>

              <div>
                <label className="input-label">Internal Note / Message</label>
                <textarea 
                  className="input-field" 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  placeholder="Add a note to the timeline..." 
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Updates</button>
            </form>
          </div>

          {/* Timeline Card */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} /> Order Timeline
            </h2>

            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
              
              {logs.length > 0 ? logs.map((log, index) => (
                <div key={index} style={{ position: 'relative', marginBottom: index === logs.length - 1 ? '0' : '2rem' }}>
                  {/* Dot */}
                  <div style={{ position: 'absolute', left: '-1.5rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-primary)', border: '4px solid #fff', boxShadow: '0 0 0 1px var(--border-color)' }}></div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    {new Date(log.date).toLocaleString()}
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Status changed to <span style={{ padding: '0.15rem 0.5rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}>{log.status}</span>
                  </div>
                  
                  {log.note && (
                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-primary)' }}>
                      {log.note}
                    </div>
                  )}

                  {(log.courierName || log.trackingNumber) && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                      {log.courierName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                          <Truck size={14} /> {log.courierName}
                        </div>
                      )}
                      {log.trackingNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                          <Package size={14} /> Tracking: {log.trackingNumber}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No logs available.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;

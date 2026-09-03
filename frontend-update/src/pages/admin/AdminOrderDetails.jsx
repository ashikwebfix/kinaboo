import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, MapPin, User, FileText, CheckCircle, Clock, Package, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

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
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select the precise delivery destination to generate a Pathao Consignment ID.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              <div style={{ display: 'flex', gap: '1rem' }}>
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
        <div style={{ display: 'flex', gap: '1rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: INVOICE */}
        <div ref={printRef} style={{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billed To</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong>{order.name}</strong><br />
                {order.phone}<br />
                {order.user?.email}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipped To</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {order.shippingAddress}<br />
                {order.city}<br />
                {order.postalCode && `Postal Code: ${order.postalCode}`}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Item Description</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems?.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                    <div style={{ fontWeight: 500 }}>{item.product?.name || 'Unknown Product'}</div>
                    {item.selectedVariations && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {Object.entries(item.selectedVariations).map(([k,v]) => `${k}: ${v}`).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.qty}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{Number(item.price).toFixed(2)} BDT</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 500, color: 'var(--text-primary)' }}>{(item.qty * Number(item.price)).toFixed(2)} BDT</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>Subtotal</span>
                <span>{(Number(order.totalPrice) - Number(order.shippingCost) + Number(order.discount)).toFixed(2)} BDT</span>
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
                <span>{Number(order.totalPrice).toFixed(2)} BDT</span>
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

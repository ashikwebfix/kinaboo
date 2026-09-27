import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Package, Clock, CheckCircle, Heart, SearchX, Truck, X } from 'lucide-react';
import useFavoritesStore from '../store/useFavoritesStore';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'favorites'
  const { favorites } = useFavoritesStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchMyOrders();
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, phone, address })
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        
        // Update local storage just in case name changed
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.name = data.name;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        setEditMode(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTrackPackage = async (consignmentId) => {
    setTrackingModalOpen(true);
    setTrackingLoading(true);
    setTrackingData(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pathao/tracking/${consignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrackingData(data.data || data);
      } else {
        setTrackingData({ error: 'Tracking data unavailable right now.' });
      }
    } catch (error) {
      setTrackingData({ error: 'Error connecting to tracking service.' });
    } finally {
      setTrackingLoading(false);
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

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      {/* Tracking Modal */}
      {trackingModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--accent-primary)" /> Live Tracking Status
              </h2>
              <button onClick={() => setTrackingModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            {trackingLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading live data from courier...</div>
            ) : trackingData?.error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{trackingData.error}</div>
            ) : trackingData ? (
              <div>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current Status</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    {trackingData.order_status || trackingData.status || 'Unknown'}
                  </div>
                </div>

                {trackingData.order_history && Array.isArray(trackingData.order_history) && trackingData.order_history.length > 0 && (
                  <div style={{ position: 'relative', paddingLeft: '1rem', marginTop: '1rem' }}>
                    <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
                    {trackingData.order_history.map((event, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: i === trackingData.order_history.length - 1 ? '0' : '1.5rem' }}>
                        <div style={{ position: 'absolute', left: '-1.5rem', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', border: '2px solid #fff' }}></div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(event.created_at || new Date()).toLocaleString()}</div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{event.status || event.reason || 'Status Updated'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>No tracking information available.</div>
            )}
          </div>
        </div>
      )}

      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>My Account</h1>

      <div className="profile-layout" style={{ gap: '2rem' }}>
        {/* Profile Card */}
        <div>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{profile.name}</h2>
                <p className="text-muted" style={{ margin: 0 }}>{profile.email}</p>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Name</label>
                  <input className="input-field" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Phone</label>
                  <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Address</label>
                  <textarea className="input-field" rows="3" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Phone size={18} /> {profile.phone || 'No phone added'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={18} /> {profile.address || 'No address added'}
                </div>
                <button className="btn btn-secondary" onClick={() => setEditMode(true)} style={{ width: '100%', justifyContent: 'center' }}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Tabs (Orders/Favorites) */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ 
                background: 'none', border: 'none', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
                color: activeTab === 'orders' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'orders' ? '2px solid var(--accent-primary)' : '2px solid transparent'
              }}
            >
              Order History
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              style={{ 
                background: 'none', border: 'none', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
                color: activeTab === 'favorites' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'favorites' ? '2px solid var(--accent-primary)' : '2px solid transparent'
              }}
            >
              My Favorites ({favorites.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div style={{ background: '#f9fafb', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
                  <Package size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>No orders yet</h3>
                  <p className="text-muted" style={{ margin: 0 }}>When you buy something, it will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => {
                    const colors = getStatusColor(order.status);
                    return (
                      <div key={order.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>Order #{order.id.slice(0,6).toUpperCase()}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <span style={{ background: colors.bg, color: colors.text, padding: '0.35rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 500 }}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        
                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {order.orderItems.map(item => (
                              <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                                <img src={item.product?.image} alt="Product" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {item.qty} &nbsp;&nbsp;|&nbsp;&nbsp; {item.selectedVariations ? JSON.stringify(item.selectedVariations) : ''}</div>
                                </div>
                                <div style={{ fontWeight: 600 }}>{Number(item.price).toFixed(2)} BDT</div>
                              </div>
                            ))}
                          </div>
                          
                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Total Amount</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{Number(order.totalPrice).toFixed(2)} BDT</span>
                          </div>
                        </div>
                        {order.trackingNumber && order.courierName?.toLowerCase() === 'pathao' && (
                          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => handleTrackPackage(order.trackingNumber)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            >
                              <Truck size={16} /> Track Package
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favorites.length === 0 ? (
                <div style={{ background: '#f9fafb', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
                  <Heart size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>No favorites yet</h3>
                  <p className="text-muted" style={{ margin: 0 }}>Save items you love to easily find them later.</p>
                </div>
              ) : (
                <div className="profile-favorites-grid">
                  {favorites.map(product => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
